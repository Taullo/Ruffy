import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';

import { Provider as ReduxProvider } from 'react-redux';

import { ScrollContext } from 'react-router-scroll-4';

import { fetchCustomEmojis } from 'flavours/aether/actions/custom_emojis';
import { checkDeprecatedLocalSettings } from 'flavours/aether/actions/local_settings';
import { hydrateStore } from 'flavours/aether/actions/store';
import { connectUserStream } from 'flavours/aether/actions/streaming';
import ErrorBoundary from 'flavours/aether/components/error_boundary';
import { Router } from 'flavours/aether/components/router';
import UI from 'flavours/aether/features/ui';
import initialState, { title as siteTitle } from 'flavours/aether/initial_state';
import { IntlProvider } from 'flavours/aether/locales';
import { store } from 'flavours/aether/store';

const title = process.env.NODE_ENV === 'production' ? siteTitle : `${siteTitle} (Dev)`;

const hydrateAction = hydrateStore(initialState);
store.dispatch(hydrateAction);

// check for deprecated local settings
store.dispatch(checkDeprecatedLocalSettings());

if (initialState.meta.me) {
  store.dispatch(fetchCustomEmojis());
}

const createIdentityContext = state => ({
  signedIn: !!state.meta.me,
  accountId: state.meta.me,
  disabledAccountId: state.meta.disabled_account_id,
  accessToken: state.meta.access_token,
  permissions: state.role ? state.role.permissions : 0,
});

export default class Mastodon extends PureComponent {

  static childContextTypes = {
    identity: PropTypes.shape({
      signedIn: PropTypes.bool.isRequired,
      accountId: PropTypes.string,
      disabledAccountId: PropTypes.string,
      accessToken: PropTypes.string,
    }).isRequired,
  };

  identity = createIdentityContext(initialState);

  getChildContext() {
    return {
      identity: this.identity,
    };
  }

  componentDidMount() {
    if (this.identity.signedIn) {
      this.disconnect = store.dispatch(connectUserStream());
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  shouldUpdateScroll (_, { location }) {
    return !(location.state?.mastodonModalKey);
  }

  render () {
    return (
      <IntlProvider>
        <ReduxProvider store={store}>
          <ErrorBoundary>
            <Router>
              <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                <Route path='/' component={UI} />
              </ScrollContext>
            </Router>

            <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`} />
          </ErrorBoundary>
        </ReduxProvider>
      </IntlProvider>
    );
  }

}
