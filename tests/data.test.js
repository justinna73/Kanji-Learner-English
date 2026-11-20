import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { messages } from '../src/i18n/messages.js';
import { textFor, wordMeaning, statusFor, validateProgress } from '../src/data/helpers.js';

const data=JSON.parse(fs.readFileSync(new URL('../src/data/curriculum.json',import.meta.url),'utf8'));
test('curriculum retains all sets and Korean story translations',()=>{
  assert.equal(data.kanji.length,1110); assert.equal(data.stories.length,135);
  assert.equal(new Set(data.kanji.map(k=>k.char)).size,1110);
  assert(data.kanji.every(k=>k.meaning&&k.writing&&k.words.length===2));
  assert(data.stories.every(s=>s.japanese&&s.translationKo));
});
test('English availability is explicit and translated words match their kanji',()=>{
  assert.equal(data.kanji.filter(k=>k.en).length,50);
  for(const k of data.kanji.slice(0,50)) { assert(textFor(k,'en','meaning'));assert(textFor(k,'en','writing'));for(const w of k.words)assert(wordMeaning(k,w,'en')); }
  assert.equal(textFor(data.kanji[50],'en','meaning'),'');
  assert(textFor(data.kanji[50],'ko','meaning'));
});
test('UI message keys are consistent',()=>assert.deepEqual(Object.keys(messages.en).sort(),Object.keys(messages.ko).sort()));
test('original backup format is accepted and malformed data is rejected',()=>{
  const k=data.kanji[0], parsed=validateProgress({version:2,statuses:{[k.char]:'known',junk:'known'},wordStatuses:{[`${k.char}:0`]:'review',[`${k.char}:9`]:'known'},completedSets:{0:true,100:true}},data.kanji);
  assert.equal(statusFor(k,0,parsed),'review');assert.equal(statusFor(k,1,parsed),'known');
  assert.deepEqual(parsed.completedSets,{'0':true});assert(!('junk' in parsed.statuses));
  assert.throws(()=>validateProgress({version:99,statuses:{}},data.kanji));
});
