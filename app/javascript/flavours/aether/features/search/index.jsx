import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import { NavLink, Switch, Route } from 'react-router-dom';
import Search from 'flavours/aether/features/compose/containers/search_container';
import SearchResults from './results';
import { Helmet } from 'react-helmet';

const messages = defineMessages({
  title: { id: 'search.title', defaultMessage: 'Search' },
  searchResults: { id: 'explore.search_results', defaultMessage: 'Search results' },
});

const mapStateToProps = state => ({
  layout: state.getIn(['meta', 'layout']),
  isSearching: state.getIn(['search', 'submitted']),
});

class SearchPage extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
    isSearching: PropTypes.bool,
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  render() {
    const { intl, multiColumn, isSearching } = this.props;
    const { signedIn } = this.context.identity;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
        <ColumnHeader
          icon='search'
          title={intl.formatMessage(isSearching ? messages.searchResults : messages.title)}
          onClick={this.handleHeaderClick}
          multiColumn={multiColumn}
        />

        <div className='explore__search-header'>
          <Search />
        </div>

        <div className='scrollable scrollable--flex'>
            <SearchResults />

              <Helmet>
                <title>{intl.formatMessage(messages.title)}</title>
                <meta name='robots' content='noindex' />
              </Helmet>
        </div>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(SearchPage));
