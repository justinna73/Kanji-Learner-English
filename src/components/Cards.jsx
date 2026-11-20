import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n';
import { STATUS_KEYS, statusFor, wordMeaning } from '../data/helpers';

export default function Cards({ list, progress, updateWord }) {
  const { language, t } = useLanguage();
  const [category,setCategory]=useState('all'), [index,setIndex]=useState(0), [revealed,setRevealed]=useState(false);
  const cards=useMemo(()=>list.flatMap(k=>k.words.map((word,i)=>({k,word,i}))).filter(({k,i})=>category==='all'||statusFor(k,i,progress)===category),[list,category,progress]);
  useEffect(()=>{setIndex(0);setRevealed(false);},[category,list]);
  const card=cards[Math.min(index, Math.max(0,cards.length-1))];
  const move=n=>{if(cards.length){setIndex((Math.min(index,cards.length-1)+n+cards.length)%cards.length);setRevealed(false);}};
  return <div className="card-page"><p>{t('cardHelp')}</p><label>{t('category')} <select value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{t('all')}</option>{STATUS_KEYS.map(s=><option key={s} value={s}>{t(s)}</option>)}</select></label>
    {card ? <><p>{Math.min(index,cards.length-1)+1} / {cards.length} · {t(statusFor(card.k,card.i,progress)||'unselected')}</p><button className="flash" onClick={()=>setRevealed(!revealed)}><small>{t(revealed?'hide':'reveal')}</small><strong lang="ja">{card.word.word}</strong>{revealed&&<><span lang="ja">{card.word.reading}</span><span>{wordMeaning(card.k,card.word,language)||t('unavailable')}</span></>}</button>
      <div className="actions centered"><button onClick={()=>move(-1)}>{t('previous')}</button>{STATUS_KEYS.map(s=><button key={s} onClick={()=>{updateWord(card.k.char,card.i,s);setRevealed(false);if(category==='all')move(1);}}>{t(s)}</button>)}<button onClick={()=>move(1)}>{t('next')}</button></div></> : <p>{t('noCards')}</p>}</div>;
}
