import { PureComponent } from 'react';

import { Provider } from 'react-redux';

import { fetchCustomEmojis } from 'flavours/aether/actions/custom_emojis';
import { hydrateStore } from 'flavours/aether/actions/store';
import Compose from 'flavours/aether/features/standalone/compose';
import initialState from 'flavours/aether/initial_state';
import { IntlProvider } from 'flavours/aether/locales';
import { store } from 'flavours/aether/store';

if (initialState) {
  store.dispatch(hydrateStore(initialState));
}

store.dispatch(fetchCustomEmojis());

export default class ComposeContainer extends PureComponent {

  render () {
    return (
      <IntlProvider>
        <Provider store={store}>
          <Compose />
        </Provider>
      </IntlProvider>
    );
  }

}
