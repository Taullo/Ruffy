import PropTypes from 'prop-types';
import React from 'react';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Icon } from 'flavours/aether/components/icon';

const messages = defineMessages({
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
});

const dateFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour12: false,
  hour: '2-digit',
  minute: '2-digit',
};

class Fields extends ImmutablePureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    account: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
    hidden: PropTypes.bool,
    suspended: PropTypes.bool,
    fields: ImmutablePropTypes.map,
  };

  render () {
    const { account, hidden, intl, suspended, fields } = this.props;

    if (!account) {
      return null;
    }

    return (
      <div className={classNames('account__fields__block', { inactive: !!account.get('moved') })}>
        {!(suspended || hidden) && (
          <div className='account__fields'>

            <dl>
              <dt><FormattedMessage id='account.joined_short' defaultMessage='Joined' /></dt>
              <dd>{intl.formatDate(account.get('created_at'), { year: 'numeric', month: 'long', day: '2-digit' })}</dd>
            </dl>

            {fields.map((pair, i) => (
              <dl key={i}>
                <dt dangerouslySetInnerHTML={{ __html: pair.get('name_emojified') }} title={pair.get('name')} />

                <dd className={pair.get('verified_at') && 'verified'} title={pair.get('value_plain')}>
                  {pair.get('verified_at') && <span title={intl.formatMessage(messages.linkVerifiedOn, { date: intl.formatDate(pair.get('verified_at'), dateFormatOptions) })}><Icon id='check' className='verified__mark' /></span>} <span dangerouslySetInnerHTML={{ __html: pair.get('value_emojified') }} className='translate' />
                </dd>
              </dl>
            ))}
          </div>
        )}
      </div>
    );
  }

}

export default injectIntl(Fields);
