import React from 'react';
import ReactDOM from 'react-dom';
import { setupBrowserNotifications } from 'flavours/aether/actions/notifications';
import Mastodon, { store } from 'flavours/aether/containers/mastodon';
import { me } from 'flavours/aether/initial_state';
import ready from 'flavours/aether/ready';

const perf = require('flavours/aether/performance');

/**
 * @returns {Promise<void>}
 */
function main() {
  perf.start('main()');

  return ready(async () => {
    const mountNode = document.getElementById('mastodon');
    const props = JSON.parse(mountNode.getAttribute('data-props'));

    ReactDOM.render(<Mastodon {...props} />, mountNode);
    store.dispatch(setupBrowserNotifications());

    if (process.env.NODE_ENV === 'production' && me && 'serviceWorker' in navigator) {
      const { Workbox } = await import('workbox-window');
      const wb = new Workbox('/sw.js');
      /** @type {ServiceWorkerRegistration} */
      let registration;

      try {
        registration = await wb.register();
      } catch (err) {
        console.error(err);
      }

      if (registration) {
        const registerPushNotifications = await import('flavours/aether/actions/push_notifications');

        store.dispatch(registerPushNotifications.register());
      }
    }

    perf.stop('main()');
  });
}

export default main;
