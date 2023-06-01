import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import AccountCard from 'flavours/aether/features/directory/components/account_card';
import LoadingIndicator from 'flavours/aether/components/loading_indicator';
import { connect } from 'react-redux';
import { fetchSuggestions, dismissSuggestion } from 'flavours/aether/actions/suggestions';
import { FormattedMessage } from 'react-intl';

const mapStateToProps = state => ({
  suggestions: state.getIn(['suggestions', 'items']),
  isLoading: state.getIn(['suggestions', 'isLoading']),
});

class Suggestions extends React.PureComponent {

  static propTypes = {
    isLoading: PropTypes.bool,
    suggestions: ImmutablePropTypes.list,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchSuggestions(true));
  }

  handleDismiss = (accountId) => {
    const { dispatch } = this.props;
    dispatch(dismissSuggestion(accountId));
  };

  render () {
    const { isLoading, suggestions } = this.props;

    if (!isLoading && suggestions.isEmpty()) {
      return (
        <div className='explore__suggestions scrollable scrollable--flex'>
          <div className='empty-column-indicator'>
            <FormattedMessage id='empty_column.explore_suggestions' defaultMessage="We don't have any suggestions. Check back later!" />
          </div>
        </div>
      );
    }

    return (
      <div className='explore__suggestions'>
        {isLoading ? <LoadingIndicator /> : suggestions.map(suggestion => (
          <AccountCard key={suggestion.get('account')} id={suggestion.get('account')} onDismiss={suggestion.get('source') === 'past_interactions' ? this.handleDismiss : null} />
        ))}
      </div>
    );
  }

}

export default connect(mapStateToProps)(Suggestions);
