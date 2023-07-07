import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';
import { NavLink, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import Column from 'flavours/aether/components/column';
import ColumnHeader from 'flavours/aether/components/column_header';
import Search from 'flavours/aether/features/compose/containers/search_container';

import Statuses from './statuses';
import Suggestions from './suggestions';
import Tags from './tags';


const messages = defineMessages({
  title: { id: 'explore.title', defaultMessage: 'Explore' },
  more: { id: 'status.more', defaultMessage: 'More' },
});

const mapStateToProps = state => ({
  layout: state.getIn(['meta', 'layout']),
});

class Explore extends PureComponent {

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
            icon='globe'
            title={intl.formatMessage(messages.title)}
            onClick={this.handleHeaderClick}
            multiColumn={multiColumn}
          />

          <div className='right_column'>
            <div className='fixed_wrapper'>
              <div className='explore__search-header'>
                <Search />
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
          </div>

          <div className='scrollable scrollable--flex community-scroll'>
            <div className='account__section-headline'>
              <NavLink exact to='/explore/local'>
                <FormattedMessage tagName='div' id='firehose.local' defaultMessage='Local' />
              </NavLink>

              <NavLink exact to='/explore/remote'>
                <FormattedMessage tagName='div' id='firehose.remote' defaultMessage='Remote' />
              </NavLink>

              <NavLink exact to='/explore/all'>
                <FormattedMessage tagName='div' id='firehose.all' defaultMessage='All' />
              </NavLink>

              <NavLink exact to='/explore/posts'>
                <FormattedMessage tagName='div' id='explore.trending_statuses' defaultMessage='Popular' />
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
