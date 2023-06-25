import PropTypes from 'prop-types';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import InnerHeader from 'flavours/aether/features/account/components/header';

import MemorialNote from './memorial_note';
import MovedNote from './moved_note';

export default class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onDirect: PropTypes.func.isRequired,
    onReblogToggle: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onBlockDomain: PropTypes.func.isRequired,
    onUnblockDomain: PropTypes.func.isRequired,
    onEndorseToggle: PropTypes.func.isRequired,
    onAddToList: PropTypes.func.isRequired,
    onChangeLanguages: PropTypes.func.isRequired,
    onInteractionModal: PropTypes.func.isRequired,
    onOpenAvatar: PropTypes.func.isRequired,
    domain: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  };

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  };

  handleMention = () => {
    this.props.onMention(this.props.account, this.context.router.history);
  };

  handleDirect = () => {
    this.props.onDirect(this.props.account, this.context.router.history);
  };

  handleReport = () => {
    this.props.onReport(this.props.account);
  };

  handleReblogToggle = () => {
    this.props.onReblogToggle(this.props.account);
  };

  handleNotifyToggle = () => {
    this.props.onNotifyToggle(this.props.account);
  };

  handleMute = () => {
    this.props.onMute(this.props.account);
  };

  handleBlockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1];

    if (!domain) return;

    this.props.onBlockDomain(domain);
  };

  handleUnblockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1];

    if (!domain) return;

    this.props.onUnblockDomain(domain);
  };

  handleEndorseToggle = () => {
    this.props.onEndorseToggle(this.props.account);
  };

  handleAddToList = () => {
    this.props.onAddToList(this.props.account);
  };

  handleEditAccountNote = () => {
    this.props.onEditAccountNote(this.props.account);
  };

  handleChangeLanguages = () => {
    this.props.onChangeLanguages(this.props.account);
  };

  handleInteractionModal = () => {
    this.props.onInteractionModal(this.props.account);
  };

  handleOpenAvatar = () => {
    this.props.onOpenAvatar(this.props.account);
  };

  render () {
    const { account, hidden } = this.props;

    if (account === null) {
      return null;
    }

    return (
      <div className='account-timeline__header'>
        {(!hidden && account.get('memorial')) && <MemorialNote />}
        {(!hidden && account.get('moved')) && <MovedNote from={account} to={account.get('moved')} />}

        <InnerHeader
          account={account}
          onFollow={this.handleFollow}
          onBlock={this.handleBlock}
          onMention={this.handleMention}
          onDirect={this.handleDirect}
          onReblogToggle={this.handleReblogToggle}
          onNotifyToggle={this.handleNotifyToggle}
          onReport={this.handleReport}
          onMute={this.handleMute}
          onBlockDomain={this.handleBlockDomain}
          onUnblockDomain={this.handleUnblockDomain}
          onEndorseToggle={this.handleEndorseToggle}
          onAddToList={this.handleAddToList}
          onEditAccountNote={this.handleEditAccountNote}
          onChangeLanguages={this.handleChangeLanguages}
          onInteractionModal={this.handleInteractionModal}
          onOpenAvatar={this.handleOpenAvatar}
          domain={this.props.domain}
          hidden={hidden}
        />

      </div>
    );
  }

}
