export const STATUS_KEYS = ['practice', 'review', 'later', 'known'];
export function textFor(kanji, language, field) {
  return language === 'ko' ? kanji[field] : (kanji.en?.[field] || '');
}
export function wordMeaning(kanji, word, language) {
  return language === 'ko' ? word.meaning : (kanji.en?.words?.[word.word] || '');
}
export function statusFor(kanji, index, progress) {
  const id = `${kanji.char}:${index}`;
  return Object.hasOwn(progress.wordStatuses, id) ? progress.wordStatuses[id] : (progress.statuses[kanji.char] || null);
}
export function validateProgress(input, kanji) {
  if (!input || ![1, 2].includes(input.version) || !input.statuses || Array.isArray(input.statuses) || typeof input.statuses !== 'object') throw Error('Invalid progress file');
  const characters = new Map(kanji.map(k => [k.char, k]));
  const statuses = {}, wordStatuses = {}, completedSets = {};
  for (const [char, value] of Object.entries(input.statuses)) if (characters.has(char) && STATUS_KEYS.includes(value)) statuses[char] = value;
  for (const [id, value] of Object.entries(input.wordStatuses || {})) {
    const separator = id.lastIndexOf(':'), char = id.slice(0, separator), index = Number(id.slice(separator + 1));
    if (separator > 0 && characters.has(char) && Number.isInteger(index) && index >= 0 && index < characters.get(char).words.length && (value === null || STATUS_KEYS.includes(value))) wordStatuses[id] = value;
  }
  for (const [set, value] of Object.entries(input.completedSets || {})) if (/^\d+$/.test(set) && +set < Math.ceil(kanji.length / 25) && value === true) completedSets[set] = true;
  return {statuses, wordStatuses, completedSets};
}
