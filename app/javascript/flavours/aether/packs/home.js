import 'packs/public-path';
import loadPolyfills from 'flavours/aether/load_polyfills';

loadPolyfills().then(async () => {
  const { default: main } = await import('flavours/aether/main');

  return main();
}).catch(e => {
  console.error(e);
});
