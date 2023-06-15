import 'packs/public-path';
import { loadLocale } from 'flavours/aether/locales';
import main from "flavours/aether/main";
import { loadPolyfills } from 'flavours/aether/polyfills';

loadPolyfills()
  .then(loadLocale)
  .then(main)
  .catch(e => {
    console.error(e);
  });
