import { useState } from 'react';
import { useLanguage } from '../i18n';

const firstChapterEnglish = `“Don't save me at 6:17.”

That was what the note said. A girl I had never met had handed it to me at a university welcome event. She introduced herself as Riko. Even though I hadn't told her my name, she smiled and called me Yuma.

In the courtyard at dusk, the music club was about to perform. I stood at the edge of the crowd, still unable to decide which club to join or where to work part-time. University was supposed to mean freedom, yet every choice felt a little frightening. An old camera hung around Riko's neck on a blue strap. “There are only five shots. Don't waste them,” she said, pressing it into my hands.

At 6:17, an eerie metallic sound rang out above the stage. A light came loose, and Riko was standing directly beneath it. Before I could think, I ran. The instant I pulled her close, a white light flared beneath my feet. My finger pressed the shutter of its own accord.

When I opened my eyes again, the clock read exactly six. The performance had not started. Only the number of shots left on the camera had changed: it was now four.`;

export default function Stories({ stories }) {
  const {language,t}=useLanguage();
  const [index,setIndex]=useState(()=>Math.max(0,stories.findIndex(s=>s.seriesId))),[show,setShow]=useState(false);
  const story=stories[index], english=story?.seriesId==='shinkan-loop-01' && story?.chapter===1 ? firstChapterEnglish : '';
  const translated=language==='ko'?story?.translationKo:english;
  return <><p>{t('storyHelp')}</p><label>{t('stories')} <select className="story-select" value={index} onChange={e=>{setIndex(+e.target.value);setShow(false);}}>{stories.map((s,i)=><option value={i} key={i}>{s.title}</option>)}</select></label>
    {story && <article className="story"><h2 lang="ja">{story.title}</h2><p className="story-text" lang="ja">{story.japanese}</p><button onClick={()=>setShow(!show)} aria-expanded={show}>{t(show?'hideTranslation':'showTranslation')}</button>{show&&<section><h3>{t('translation')}</h3><p className="story-text">{translated||t('unavailable')}</p></section>}</article>}</>;
}
