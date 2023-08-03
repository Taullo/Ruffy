import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { fetchServer, fetchExtendedDescription } from 'flavours/aether/actions/server';
import Column from 'flavours/aether/components/column';
import { ServerHeroImage } from 'flavours/aether/components/server_hero_image';
import { Skeleton } from 'flavours/aether/components/skeleton';
import Account from 'flavours/aether/containers/account_container';
import LinkFooter from 'flavours/aether/features/ui/components/link_footer';

const messages = defineMessages({
  title: { id: 'column.about', defaultMessage: 'About' },
  rules: { id: 'about.rules', defaultMessage: 'Server rules' },
});

const mapStateToProps = state => ({
  server: state.getIn(['server', 'server']),
  extendedDescription: state.getIn(['server', 'extendedDescription']),
});

class Section extends PureComponent {

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    open: PropTypes.bool,
    onOpen: PropTypes.func,
  };

  render () {
    const { title, children } = this.props;

    return (
      <div className={classNames('about__section')}>
        <div className='about__section__title' role='button' tabIndex={0} >{title}</div>
        <div className='about__section__body'>{children}</div>
      </div>
    );
  }

}

class About extends PureComponent {

  static propTypes = {
    server: ImmutablePropTypes.map,
    extendedDescription: ImmutablePropTypes.map,
    dispatch: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchServer());
    dispatch(fetchExtendedDescription());
  }

  render () {
    const { multiColumn, intl, server, extendedDescription } = this.props;
    const isLoading = server.get('isLoading');

    return (
      <Column bindToDocument={!multiColumn} label={intl.formatMessage(messages.title)}>
        <div className='scrollable about'>
         <div className='about__left-column'>
          <div className='about__header'>
            <ServerHeroImage blurhash={server.getIn(['thumbnail', 'blurhash'])} src={server.getIn(['thumbnail', 'url'])} srcSet={server.getIn(['thumbnail', 'versions'])?.map((value, key) => `${value} ${key.replace('@', '')}`).join(', ')} className='about__header__hero' />
            <h1>{isLoading ? <Skeleton width='10ch' /> : server.get('domain')}</h1>
          </div>

          <div className='about__meta'>
            <div className='about__meta__column'>
              <h4><FormattedMessage id='server_banner.administered_by' defaultMessage='Administered by:' /></h4>

              <Account id={server.getIn(['contact', 'account', 'id'])} size={36} />
            </div>

            <hr className='about__meta__divider' />

            <div className='about__meta__column'>
              <h4><FormattedMessage id='about.contact' defaultMessage='Contact:' /></h4>

              {isLoading ? <Skeleton width='10ch' /> : <a className='about__mail' href={`mailto:${server.getIn(['contact', 'email'])}`}>{server.getIn(['contact', 'email'])}</a>}
            </div>
          </div>

            {extendedDescription.get('isLoading') ? (
              <>
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='100%' />
                <br />
                <Skeleton width='70%' />
              </>
            ) : (extendedDescription.get('content')?.length > 0 ? (
              <div
                className='prose'
                dangerouslySetInnerHTML={{ __html: extendedDescription.get('content') }}
              />
            ) : (''))}
         </div>
         <div className='about__right-column'>
          <Section title={intl.formatMessage(messages.rules)}>
            {!isLoading && (server.get('rules', []).isEmpty() ? (
              <p><FormattedMessage id='about.not_available' defaultMessage='This information has not been made available on this server.' /></p>
            ) : (
              <ol className='rules-list'>
                {server.get('rules').map(rule => (
                  <li key={rule.get('id')}>
                    <span className='rules-list__text'>{rule.get('text')}</span>
                  </li>
                ))}
              </ol>
            ))}
          </Section>

          <LinkFooter />

         </div>
        </div>

        <Helmet>
          <title>{intl.formatMessage(messages.title)}</title>
          <meta name='robots' content='all' />
        </Helmet>
      </Column>
    );
  }

}


export default connect(mapStateToProps)(injectIntl(About));
