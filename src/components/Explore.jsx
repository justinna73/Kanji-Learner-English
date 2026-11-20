import { useState, useEffect } from 'react';
import { useLanguage } from '../i18n';
import { STATUS_KEYS, statusFor, textFor, wordMeaning } from '../data/helpers';

export default function Explore({ list, all, set, setSet, progress, updateKanji, toggleComplete, examples }) {
  const { language, t } = useLanguage();
  const [query, setQuery] = useState(''), [selected, setSelected] = useState(list[0]?.char), [show, setShow] = useState(true);
  useEffect(() => { if (!list.some(k => k.char === selected)) setSelected(list[0]?.char); }, [list, selected]);
  const visible = list.filter(k => [k.char,k.meaning,k.en?.meaning,k.onyomi,k.kunyomi,...k.words.flatMap(w=>[w.word,w.reading,w.meaning,k.en?.words?.[w.word]])].join(' ').toLowerCase().includes(query.toLowerCase()));
  const k = all.find(x => x.char === selected);
  const speak = text => { if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(text); u.lang='ja-JP'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } };
  return <>
    <div className="toolbar"><label>{t('set')} <select value={set} onChange={e=>setSet(e.target.value)}>{Array.from({length:Math.ceil(all.length/25)},(_,i)=><option value={i} key={i}>{t('set')} {i+1}{progress.completedSets[i]?' ✓':''}</option>)}</select></label>
      <label className="check"><input type="checkbox" checked={!!progress.completedSets[set]} onChange={e=>toggleComplete(set,e.target.checked)}/>{t('complete')}</label>
      <label className="search">{t('search')}<input type="search" value={query} onChange={e=>setQuery(e.target.value)} /></label>
      <label className="check"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)} />{t('meanings')}</label></div>
    <div className="study-layout"><div className="grid">{visible.length ? visible.map(item=><button key={item.char} className={'tile '+(item.char===selected?'selected':'')} onClick={()=>setSelected(item.char)} aria-pressed={item.char===selected}><strong lang="ja">{item.char}</strong>{show && <small>{textFor(item,language,'meaning') || '—'}</small>}</button>) : <p>{t('noResults')}</p>}</div>
      {k && <aside className="detail"><div className="detail-heading"><span className="large-kanji" lang="ja">{k.char}</span><div>{show && <h2>{textFor(k,language,'meaning') || t('unavailable')}</h2>}<p>{k.strokes} {t('strokes')}</p></div><button className="icon" onClick={()=>speak(k.char)} aria-label={t('listening')}>♪</button></div>
        <p><b>{t('on')}:</b> <span lang="ja">{k.onyomi}</span><br/><b>{t('kun')}:</b> <span lang="ja">{k.kunyomi}</span></p>
        {show && <><h3>{t('writingGuide')}</h3><p>{textFor(k,language,'writing') || t('noWritingGuide')}</p></>}
        <h3>{t('examples')}</h3>{k.words.map((w,i)=><div className="word" key={i}><div><b lang="ja">{w.word}</b> <span lang="ja">{w.reading}</span>{show && <p>{wordMeaning(k,w,language) || t('unavailable')}</p>}{examples[w.word] && <small lang="ja">{examples[w.word].sentence}</small>}</div><button className="icon" onClick={()=>speak(w.word)} aria-label={t('listening')}>♪</button></div>)}
        <h3>{t('mark')}</h3><div className="actions">{STATUS_KEYS.map(status=><button key={status} aria-pressed={k.words.every((_,i)=>statusFor(k,i,progress)===status)} onClick={()=>updateKanji(k.char,status)}>{t(status)}</button>)}</div></aside>}</div>
  </>;
}
