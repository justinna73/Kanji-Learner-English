# Kanji Study Notebook — React work in progress

This is a separate copy and an **incomplete migration** of the original app. The copied original is in the parent folder, and a second copy is included in `public/legacy` so that the original Korean app can also be served with the React project. The original folder supplied by the user was not modified.

## What is here

- React components for kanji exploration, vocabulary cards, writing practice and story reading.
- An English/Korean message system with English as the default, and a saved language preference.
- The complete original dataset: 1,110 kanji, 2,220 vocabulary entries and 135 stories, including the Korean content. The English meanings and writing explanations cover sets 1–2 (50 kanji and 100 words); one story has an English translation. Other English translations and the original app's more advanced features remain to be migrated. Missing English text is identified in the UI.
- Import/export for the original app's version 1 and 2 card progress JSON format. Browser storage is scoped to the site's origin: a file opened directly and a local or deployed web server do not necessarily share progress. Export from the old app and import in the new one.
- The legacy app retains features not yet reproduced here, including furigana, mnemonic explanations, richer story navigation and more advanced card controls. Use the link in the React app or open `../0.open this.html` directly.

## Running the project

Install Node.js with npm from [nodejs.org](https://nodejs.org/) if they are not already installed. In a terminal opened in this folder, run:

```sh
npm install
npm run dev
```

Open the local address shown in the terminal. To create a static website bundle, run `npm run build`. The resulting `dist` folder can be hosted on a static web host. Run `npm run preview` to inspect the build locally.

If the copied original data is changed, run `npm run prepare:data` to regenerate `src/data/curriculum.json` and refresh `public/legacy`. This script reads the parent copy, not the source folder. The manually translated second set lives in `src/data/set-02-en.json`; the first set's English text comes from the original `content.js`.

Run the data checks with `npm test` or `node --test tests/*.test.js`. A production build and browser test require React and Vite to be installed first.

## Current limitations

The React version is not a feature-complete replacement. It does not yet migrate all translations, mnemonics, furigana, per-story vocabulary navigation, audio playback or all original card options. It has not been built or browser-tested in the current environment because npm was unavailable and the package registry could not be reached. Complete those items and run the build and browser tests before publishing.
