import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../i18n';
import { textFor } from '../data/helpers';

export default function Writing({ list }) {
  const { language,t }=useLanguage(), canvas=useRef(null), drawing=useRef(false);
  const [char,setChar]=useState(list[0]?.char),[guide,setGuide]=useState(true);
  useEffect(()=>{setChar(list[0]?.char);},[list]);
  const k=list.find(item=>item.char===char)||list[0];
  const pos=e=>{const c=canvas.current,r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height];};
  const down=e=>{const c=canvas.current; c.setPointerCapture(e.pointerId); drawing.current=true; const x=c.getContext('2d');x.lineWidth=8;x.lineCap='round';x.strokeStyle='#263b39';x.beginPath();x.moveTo(...pos(e));};
  const move=e=>{if(!drawing.current)return;const x=canvas.current.getContext('2d');x.lineTo(...pos(e));x.stroke();};
  const clear=()=>canvas.current.getContext('2d').clearRect(0,0,500,500);
  return <><p>{t('writingHelp')}</p><div className="writing-layout"><div><label>{t('explore')} <select value={k?.char||''} onChange={e=>{setChar(e.target.value);clear();}}>{list.map(x=><option key={x.char}>{x.char}</option>)}</select></label>{k && <p>{textFor(k,language,'writing')||t('noWritingGuide')}</p>}<label className="check"><input type="checkbox" checked={guide} onChange={e=>setGuide(e.target.checked)}/>{t('showGuide')}</label><p><button onClick={clear}>{t('clear')}</button></p></div>
    <div className="canvas"><div className="trace" aria-hidden="true">{guide?k?.char:''}</div><canvas ref={canvas} width="500" height="500" onPointerDown={down} onPointerMove={move} onPointerUp={()=>drawing.current=false} onPointerCancel={()=>drawing.current=false} aria-label={t('writing')} /></div></div></>;
}
