import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import { NavLink, Switch, Route } from 'react-router-dom';
import Tags from './tags';
import Statuses from './statuses';
import Suggestions from './suggestions';
import { showTrends } from 'flavours/aether/initial_state';
import { Helmet } from 'react-helmet';
import SearchContainer from 'flavours/aether/features/compose/containers/search_container';

const messages = defineMessages({
  title: { id: 'explore.title', defaultMessage: 'Popular' },
  more: { id: 'status.more', defaultMessage: 'More' },
});

const mapStateToProps = state => ({
  layout: state.getIn(['meta', 'layout']),
});

class Explore extends React.PureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  handleHeaderClick = () => {
    this.column.scrollTop();
  };

  setRef = c => {
    this.column = c;
  };

  render() {
    const { intl, multiColumn } = this.props;
    const { signedIn } = this.context.identity;

    return (
      <Column bindToDocument={!multiColumn} ref={this.setRef} label={intl.formatMessage(messages.title)}>
       <div className='column_explore'>
        <ColumnHeader
          icon='hashtag'
          title={intl.formatMessage(messages.title)}
          onClick={this.handleHeaderClick}
          multiColumn={multiColumn}
        />

        <div className='right_column'>
          <div className='explore__search-header'>
            <SearchContainer openInRoute />
          </div>
        
          <div className='explore__tags-header'>
            <Tags openInRoute />
            <div className='right-column-show-more'>
              <NavLink className='navbutton' exact to='/explore/tags'>
                <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
              </NavLink>
            </div>
          </div>
        
        {!multiColumn && signedIn && (
          <div className='explore__suggested-header'>
            <Suggestions openInRoute />
            <div className='right-column-show-more'>
              <NavLink className='navbutton' exact to='/explore/suggestions'>
                <FormattedMessage tagName='div' id='status.more' defaultMessage='More' />
              </NavLink>
            </div>
          </div>
        )}
        </div>

        <div className='scrollable scrollable--flex'>
              <div className='account__section-headline'>
                <NavLink exact to='/explore/local'>
                  <FormattedMessage tagName='div' id='explore.local' defaultMessage='Local Timeline' />
                </NavLink>
                <NavLink exact to='/explore/federated'>
                  <FormattedMessage tagName='div' id='explore.federated' defaultMessage='Federated Timeline' />
                </NavLink>
                <NavLink exact to='/explore/posts'>
                  <FormattedMessage tagName='div' id='explore.trending_statuses' defaultMessage='Popular Posts' />
                </NavLink>
                {multiColumn && signedIn && (
                  <NavLink exact to='/explore/suggestions'>
                    <FormattedMessage tagName='div' id='explore.suggested_follows' defaultMessage='Suggested' />
                  </NavLink>
                )}
              </div>

              <Switch>
                <Route path='/explore/tags' component={Tags} />
                <Route path='/explore/suggestions' component={Suggestions} />
                <Route exact path='/explore/posts'>
                  <Statuses multiColumn={multiColumn} />
                </Route>
              </Switch>

              <Helmet>
                <title>{intl.formatMessage(messages.title)}</title>
                <meta name='robots' content='all' />
              </Helmet>
        </div>
       </div>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(Explore));
