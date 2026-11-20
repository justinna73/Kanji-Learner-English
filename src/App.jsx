import { useEffect, useMemo, useRef, useState } from 'react';
import curriculum from './data/curriculum.json';
import { validateProgress } from './data/helpers';
import { useLanguage } from './i18n';
import Explore from './components/Explore';
import Cards from './components/Cards';
import Writing from './components/Writing';
import Stories from './components/Stories';

const keys={statuses:'kanji-notebook-card-status-v2',wordStatuses:'kanji-notebook-word-status-v1',completedSets:'kanji-notebook-completed-sets-v1'};
function loadProgress(){
  try { const data={version:2}; for(const [field,key] of Object.entries(keys)) data[field]=JSON.parse(localStorage.getItem(key)||'{}'); return validateProgress(data,curriculum.kanji); }
  catch { return {statuses:{},wordStatuses:{},completedSets:{}}; }
}
export default function App(){
  const {language,setLanguage,t}=useLanguage(), [tab,setTab]=useState('explore'), [set,setSet]=useState('0'), [progress,setProgress]=useState(loadProgress), [notice,setNotice]=useState('');
  const input=useRef(null), list=useMemo(()=>curriculum.kanji.slice(+set*25,+set*25+25),[set]);
  useEffect(()=>{try {for(const [field,key] of Object.entries(keys)) localStorage.setItem(key,JSON.stringify(progress[field]));}catch{/* Browser storage may be disabled. */}},[progress]);
  const updateKanji=(char,status)=>setProgress(p=>{const wordStatuses={...p.wordStatuses}; const k=curriculum.kanji.find(x=>x.char===char);k.words.forEach((_,i)=>delete wordStatuses[`${char}:${i}`]);return {...p,statuses:{...p.statuses,[char]:status},wordStatuses};});
  const updateWord=(char,index,status)=>setProgress(p=>({...p,wordStatuses:{...p.wordStatuses,[`${char}:${index}`]:status}}));
  const toggleComplete=(number,done)=>setProgress(p=>{const completedSets={...p.completedSets};if(done)completedSets[number]=true;else delete completedSets[number];return {...p,completedSets};});
  const exportProgress=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify({version:2,...progress},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='kanji-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const importProgress=async e=>{try{const parsed=JSON.parse(await e.target.files[0].text());setProgress(validateProgress(parsed,curriculum.kanji));setNotice(t('imported'));}catch{setNotice(t('invalidFile'));}finally{e.target.value='';}};
  return <><header className="topbar"><a href="#top" className="brand"><span>学</span> {t('brand')}</a><label>{t('language')} <select value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">English</option><option value="ko">한국어</option></select></label></header>
    <main id="top"><section className="hero"><div><p className="eyebrow">KANJI STUDY NOTEBOOK</p><h1>{t('tagline')}</h1><p>{t('intro')}</p></div><span className="hero-kanji" aria-hidden="true">学</span></section>
      <div className="notice">{t('partial')}</div><div className="legacy-note"><span>{t('legacyHelp')}</span><a href={`${import.meta.env.BASE_URL}legacy/0.open%20this.html`}>{t('legacy')} ↗</a></div>
      <nav className="tabs" aria-label="Study sections">{['explore','cards','writing','stories'].map((item,i)=><button key={item} onClick={()=>setTab(item)} className={tab===item?'active':''} aria-current={tab===item?'page':undefined}><small>0{i+1}</small> {t(item)}</button>)}</nav>
      <section className="panel"><h2>{t(tab)}</h2>{tab!=='explore'&&tab!=='stories'&&<label>{t('set')} <select value={set} onChange={e=>setSet(e.target.value)}>{Array.from({length:Math.ceil(curriculum.kanji.length/25)},(_,i)=><option key={i} value={i}>{t('set')} {i+1}</option>)}</select></label>}
        {tab==='explore'&&<Explore list={list} all={curriculum.kanji} set={set} setSet={setSet} progress={progress} updateKanji={updateKanji} toggleComplete={toggleComplete} examples={curriculum.examples}/>}
        {tab==='cards'&&<Cards list={list} progress={progress} updateWord={updateWord}/>}{tab==='writing'&&<Writing list={list}/>}{tab==='stories'&&<Stories stories={curriculum.stories}/>}</section>
      <footer><div><strong>{t('progress')}</strong><div className="actions"><button onClick={exportProgress}>{t('backup')}</button><button onClick={()=>input.current.click()}>{t('restore')}</button><input ref={input} type="file" accept=".json,application/json" hidden onChange={importProgress}/></div><p role="status">{notice}</p></div></footer></main></>;
}
