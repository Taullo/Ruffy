import './public-path';
import main from "flavours/aether/main"

import { start } from '../flavours/aether/common';
import { loadPolyfills } from '../flavours/aether/polyfills';
import { loadLocale } from '../mastodon/locales';

start();

loadPolyfills()
  .then(loadLocale)
  .then(main)
  .catch(e => {
    console.error(e);
  });
