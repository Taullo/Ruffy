import './public-path';
import { createRoot } from 'react-dom/client';

import { start } from '../flavours/aether/common';
import ComposeContainer  from '../flavours/aether/containers/compose_container';
import { loadPolyfills } from '../flavours/aether/polyfills';
import ready from '../flavours/aether/ready';

start();

function loaded() {
  const mountNode = document.getElementById('mastodon-compose');

  if (mountNode) {
    const attr = mountNode.getAttribute('data-props');
    if(!attr) return;

    const props = JSON.parse(attr);
    const root = createRoot(mountNode);
    root.render(<ComposeContainer {...props} />);
  }
}

function main() {
  ready(loaded);
}

loadPolyfills().then(main).catch(error => {
  console.error(error);
});
