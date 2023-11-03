import PropTypes from 'prop-types';

import { defineMessages } from 'react-intl';

import { Link } from 'react-router-dom';


import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Avatar } from 'flavours/aether/components/avatar';
import { DisplayName } from 'flavours/aether/components/display_name';
import { IconButton } from 'flavours/aether/components/icon_button';


const messages = defineMessages({
  remove: { id: 'lists.account.remove', defaultMessage: 'Remove from list' },
  add: { id: 'lists.account.add', defaultMessage: 'Add to list' },
});

export default class Account extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired,
    onAdd: PropTypes.func.isRequired,
    added: PropTypes.bool,
  };

  static defaultProps = {
    added: false,
  };

  render () {
    const { account, intl, onRemove, onAdd, added } = this.props;

    let button;

    if (added) {
      button = <IconButton icon='times' title={intl.formatMessage(messages.remove)} onClick={onRemove} />;
    } else {
      button = <IconButton icon='plus' title={intl.formatMessage(messages.add)} onClick={onAdd} />;
    }

    return (
      <div className='account'>
        <div className='account__wrapper'>
          <Link key={account.get('id')} className='account__display-name' title={account.get('acct')} href={`/@${account.get('acct')}`} to={`/@${account.get('acct')}`}>
            <div className='account__avatar-wrapper'><Avatar account={account} size={36} /></div>
            <DisplayName account={account} />
          </Link>

          <div className='account__relationship'>
            {button}
          </div>
        </div>
      </div>
    );
  }

}
