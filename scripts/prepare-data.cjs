// Build a portable snapshot from the copied original, preserving its Korean data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../..');
const html = fs.readFileSync(path.join(root, '0.open this.html'), 'utf8');
const files = [...html.matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
const window = {};
const context = vm.createContext({window});
const run = name => vm.runInContext(fs.readFileSync(path.join(root, name), 'utf8'), context, {filename: name});
run('content.js');
const english = JSON.parse(JSON.stringify(window.KANJI_DATA.kanji));
const dataFiles = files.filter(name => /^(content-ko|extra-set-\d+|story-ko-\d+|novel-series|novel-groups|novel-prologues|novel-target-lines|example-sentences|example-manual)\.js$/.test(name));
dataFiles.forEach(run);
const set02 = require('../src/data/set-02-en.json');
const kanji = window.KANJI_DATA.kanji.map(k => {
  const en = english.find(e => e.char === k.char);
  const translated = set02[k.char];
  return {...k, en: en ? {meaning:en.meaning, writing:en.writing, words:Object.fromEntries(en.words.map(w=>[w.word,w.meaning]))} : translated ? {meaning:translated[0],writing:translated[1],words:Object.fromEntries(k.words.map((w,i)=>[w.word,translated[i+2]]))} : null};
});
const output = {kanji, stories:window.KANJI_DATA.stories, examples:window.KANJI_EXAMPLES || {}};
fs.writeFileSync(path.join(__dirname, '../src/data/curriculum.json'), JSON.stringify(output));
const legacy = path.join(__dirname, '../public/legacy');
fs.mkdirSync(legacy, {recursive: true});
for (const name of fs.readdirSync(root)) if (/\.(?:js|css|html|txt)$/i.test(name)) fs.copyFileSync(path.join(root,name), path.join(legacy,name));
console.log(`Prepared ${kanji.length} kanji and ${output.stories.length} stories.`);
