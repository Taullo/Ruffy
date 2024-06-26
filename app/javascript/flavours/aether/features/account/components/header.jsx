import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

import { Avatar } from 'flavours/aether/components/avatar';
import Button from 'flavours/aether/components/button';
import { Icon } from 'flavours/aether/components/icon';
import DropdownMenuContainer from 'flavours/aether/containers/dropdown_menu_container';
import { autoPlayGif, me, domain } from 'flavours/aether/initial_state';
import { PERMISSION_MANAGE_USERS, PERMISSION_MANAGE_FEDERATION } from 'flavours/aether/permissions';
import { profileLink, accountAdminLink } from 'flavours/aether/utils/backend_links';

import { IconButton } from '../../../components/icon_button';
import AccountNoteContainer from '../containers/account_note_container';
import FollowRequestNoteContainer from '../containers/follow_request_note_container';

const messages = defineMessages({
  unfollow: { id: 'account.unfollow', defaultMessage: 'Unfollow' },
  follow: { id: 'account.follow', defaultMessage: 'Follow' },
  cancel_follow_request: { id: 'account.cancel_follow_request', defaultMessage: 'Withdraw follow request' },
  requested: { id: 'account.requested', defaultMessage: 'Awaiting approval. Click to cancel follow request' },
  unblock: { id: 'account.unblock', defaultMessage: 'Unblock @{name}' },
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit profile' },
  linkVerifiedOn: { id: 'account.link_verified_on', defaultMessage: 'Ownership of this link was checked on {date}' },
  account_locked: { id: 'account.locked_info', defaultMessage: 'This account privacy status is set to locked. The owner manually reviews who can follow them.' },
  mention: { id: 'account.mention', defaultMessage: 'Mention @{name}' },
  direct: { id: 'account.direct', defaultMessage: 'Privately mention @{name}' },
  unmute: { id: 'account.unmute', defaultMessage: 'Unmute @{name}' },
  block: { id: 'account.block', defaultMessage: 'Block @{name}' },
  mute: { id: 'account.mute', defaultMessage: 'Mute @{name}' },
  report: { id: 'account.report', defaultMessage: 'Report @{name}' },
  share: { id: 'account.share', defaultMessage: 'Share @{name}\'s profile' },
  media: { id: 'account.media', defaultMessage: 'Media' },
  blockDomain: { id: 'account.block_domain', defaultMessage: 'Block domain {domain}' },
  unblockDomain: { id: 'account.unblock_domain', defaultMessage: 'Unblock domain {domain}' },
  muteDomain: { id: 'account.mute_domain', defaultMessage: 'Mute domain {domain}' },
  unmuteDomain: { id: 'account.unmute_domain', defaultMessage: 'Unmute domain {domain}' },
  hideReblogs: { id: 'account.hide_reblogs', defaultMessage: 'Hide boosts from @{name}' },
  showReblogs: { id: 'account.show_reblogs', defaultMessage: 'Show boosts from @{name}' },
  enableNotifications: { id: 'account.enable_notifications', defaultMessage: 'Notify me when @{name} posts' },
  disableNotifications: { id: 'account.disable_notifications', defaultMessage: 'Stop notifying me when @{name} posts' },
  pins: { id: 'navigation_bar.pins', defaultMessage: 'Pinned posts' },
  endorse: { id: 'account.endorse', defaultMessage: 'Feature on profile' },
  unendorse: { id: 'account.unendorse', defaultMessage: 'Don\'t feature on profile' },
  add_or_remove_from_list: { id: 'account.add_or_remove_from_list', defaultMessage: 'Add or Remove from lists' },
  admin_account: { id: 'status.admin_account', defaultMessage: 'Open moderation interface for @{name}' },
  admin_domain: { id: 'status.admin_domain', defaultMessage: 'Open moderation interface for {domain}' },
  add_account_note: { id: 'account.add_account_note', defaultMessage: 'Add note for @{name}' },
  view_rss_feed: { id: 'account.view_rss_feed', defaultMessage: 'View RSS feed for @{name}' },
  languages: { id: 'account.languages', defaultMessage: 'Change subscribed languages' },
  openOriginalPage: { id: 'account.open_original_page', defaultMessage: 'Open original page' },
  followers: { id: 'account.followers', defaultMessage: 'Followers' },
});

const titleFromAccount = account => {
  const displayName = account.get('display_name');
  const acct = account.get('acct') === account.get('username') ? `${account.get('username')}@${domain}` : account.get('acct');
  const prefix = displayName.trim().length === 0 ? account.get('username') : displayName;

  return `${prefix} (@${acct})`;
};

class Header extends ImmutablePureComponent {

  static contextTypes = {
    identity: PropTypes.object,
  };

  static propTypes = {
    account: ImmutablePropTypes.map,
    identity_props: ImmutablePropTypes.list,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onDirect: PropTypes.func.isRequired,
    onReblogToggle: PropTypes.func.isRequired,
    onNotifyToggle: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onBlockDomain: PropTypes.func.isRequired,
    onUnblockDomain: PropTypes.func.isRequired,
    onMuteDomain: PropTypes.func.isRequired,
    onUnmuteDomain: PropTypes.func.isRequired,
    onEndorseToggle: PropTypes.func.isRequired,
    onAddToList: PropTypes.func.isRequired,
    onEditAccountNote: PropTypes.func.isRequired,
    onChangeLanguages: PropTypes.func.isRequired,
    onInteractionModal: PropTypes.func.isRequired,
    onOpenAvatar: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    domain: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
  };

  openEditProfile = () => {
    window.open(profileLink, '_blank');
  };

  handleMouseEnter = ({ currentTarget }) => {
    if (autoPlayGif) {
      return;
    }

    const emojis = currentTarget.querySelectorAll('.custom-emoji');

    for (var i = 0; i < emojis.length; i++) {
      let emoji = emojis[i];
      emoji.src = emoji.getAttribute('data-original');
    }
  };

  handleMouseLeave = ({ currentTarget }) => {
    if (autoPlayGif) {
      return;
    }

    const emojis = currentTarget.querySelectorAll('.custom-emoji');

    for (var i = 0; i < emojis.length; i++) {
      let emoji = emojis[i];
      emoji.src = emoji.getAttribute('data-static');
    }
  };

  handleAvatarClick = e => {
    if (e.button === 0 && !(e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      this.props.onOpenAvatar();
    }
  };

  handleShare = () => {
    const { account } = this.props;

    navigator.share({
      url: account.get('url'),
    }).catch((e) => {
      if (e.name !== 'AbortError') console.error(e);
    });
  };

  render () {
    const { account, hidden, intl, domain } = this.props;
    const { signedIn, permissions } = this.context.identity;

    if (!account) {
      return null;
    }

    const accountNote = account.getIn(['relationship', 'note']);

    const suspended    = account.get('suspended');
    const isRemote     = account.get('acct') !== account.get('username');
    const remoteDomain = isRemote ? account.get('acct').split('@')[1] : null;

    let info        = [];
    let actionBtn   = '';
    let bellBtn     = '';
    let lockedIcon  = '';
    let menu        = [];

    if (me !== account.get('id') && account.getIn(['relationship', 'followed_by'])) {
      info.push(<span className='relationship-tag'><FormattedMessage id='account.follows_you' defaultMessage='Follows you' /></span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'blocking'])) {
      info.push(<span className='relationship-tag'><FormattedMessage id='account.blocked' defaultMessage='Blocked' /></span>);
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'domain_muting'])) {
      info.push(<span className='relationship-tag'><FormattedMessage id='account.domain_muted' defaultMessage='Domain muted' /></span>);
    }

    if (me !== account.get('id') && account.getIn(['relationship', 'muting'])) {
      info.push(<span className='relationship-tag'><FormattedMessage id='account.muted' defaultMessage='Muted' /></span>);
    } else if (me !== account.get('id') && account.getIn(['relationship', 'domain_blocking'])) {
      info.push(<span className='relationship-tag'><FormattedMessage id='account.domain_blocked' defaultMessage='Domain blocked' /></span>);
    }

    if (account.getIn(['relationship', 'requested']) || account.getIn(['relationship', 'following'])) {
      bellBtn = <IconButton icon={account.getIn(['relationship', 'notifying']) ? 'bell' : 'bell-o'} size={1.3} active={account.getIn(['relationship', 'notifying'])} title={intl.formatMessage(account.getIn(['relationship', 'notifying']) ? messages.disableNotifications : messages.enableNotifications, { name: account.get('username') })} onClick={this.props.onNotifyToggle} />;
    }

    if (me !== account.get('id')) {
      if (signedIn && !account.get('relationship')) { // Wait until the relationship is loaded
        actionBtn = '';
      } else if (account.getIn(['relationship', 'requested'])) {
        actionBtn = <Button text={intl.formatMessage(messages.cancel_follow_request)} title={intl.formatMessage(messages.requested)} onClick={this.props.onFollow} />;
      } else if (!account.getIn(['relationship', 'blocking'])) {
        actionBtn = <Button className={classNames({ 'button--destructive': account.getIn(['relationship', 'following']) })} text={intl.formatMessage(account.getIn(['relationship', 'following']) ? messages.unfollow : messages.follow)} onClick={signedIn ? this.props.onFollow : this.props.onInteractionModal} />;
      } else if (account.getIn(['relationship', 'blocking'])) {
        actionBtn = <Button text={intl.formatMessage(messages.unblock, { name: account.get('username') })} onClick={this.props.onBlock} />;
      }
    } else if (profileLink) {
      actionBtn = <IconButton size={1.3} icon='pencil' title={intl.formatMessage(messages.edit_profile)} onClick={this.openEditProfile} />;
    }

    if (account.get('moved') && !account.getIn(['relationship', 'following'])) {
      actionBtn = '';
    }

    if (suspended && !account.getIn(['relationship', 'following'])) {
      actionBtn = '';
    }

    if (account.get('locked')) {
      lockedIcon = <Icon id='lock' title={intl.formatMessage(messages.account_locked)} />;
    }

    if (signedIn && account.get('id') !== me && !suspended) {
      menu.push({ text: intl.formatMessage(messages.mention, { name: account.get('username') }), action: this.props.onMention });
      menu.push({ text: intl.formatMessage(messages.direct, { name: account.get('username') }), action: this.props.onDirect });
      menu.push(null);
    }

    if (isRemote) {
      menu.push({ text: intl.formatMessage(messages.openOriginalPage), href: account.get('url') });
      menu.push(null);
    }

    if (!suspended) {
      if ('share' in navigator) {
        menu.push({ text: intl.formatMessage(messages.share, { name: account.get('username') }), action: this.handleShare });
      }
      if (!isRemote) {
        menu.push({ text: intl.formatMessage(messages.view_rss_feed, { name: account.get('username') }), href: ('/@' + account.get('username') + '.rss') });
      }
      else {
        menu.push({ text: intl.formatMessage(messages.view_rss_feed, { name: account.get('username') }), href: (account.get('url') + '.rss') });
      }
      menu.push(null);
    }

    if (account.get('id') !== me && (accountNote === null || accountNote === '')) {
      menu.push({ text: intl.formatMessage(messages.add_account_note, { name: account.get('username') }), action: this.props.onEditAccountNote });
    }

    if (account.get('id') === me) {
      menu.push({ text: intl.formatMessage(messages.pins), to: '/pinned', href: '/pinned' });
    } else if (signedIn) {
      if (account.getIn(['relationship', 'following'])) {
        if (!account.getIn(['relationship', 'muting'])) {
          if (account.getIn(['relationship', 'showing_reblogs'])) {
            menu.push({ text: intl.formatMessage(messages.hideReblogs, { name: account.get('username') }), action: this.props.onReblogToggle });
          } else {
            menu.push({ text: intl.formatMessage(messages.showReblogs, { name: account.get('username') }), action: this.props.onReblogToggle });
          }

          menu.push({ text: intl.formatMessage(messages.languages), action: this.props.onChangeLanguages });
          menu.push(null);
        }

        menu.push({ text: intl.formatMessage(account.getIn(['relationship', 'endorsed']) ? messages.unendorse : messages.endorse), action: this.props.onEndorseToggle });
        menu.push({ text: intl.formatMessage(messages.add_or_remove_from_list), action: this.props.onAddToList });
        menu.push(null);
      }

      if (account.getIn(['relationship', 'muting'])) {
        menu.push({ text: intl.formatMessage(messages.unmute, { name: account.get('username') }), action: this.props.onMute });
      } else {
        menu.push({ text: intl.formatMessage(messages.mute, { name: account.get('username') }), action: this.props.onMute, dangerous: true });
      }

      if (account.getIn(['relationship', 'blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblock, { name: account.get('username') }), action: this.props.onBlock });
      } else {
        menu.push({ text: intl.formatMessage(messages.block, { name: account.get('username') }), action: this.props.onBlock, dangerous: true });
      }

      menu.push({ text: intl.formatMessage(messages.report, { name: account.get('username') }), action: this.props.onReport, dangerous: true });
    }

    if (signedIn && isRemote) {
      menu.push(null);

      if (account.getIn(['relationship', 'domain_blocking'])) {
        menu.push({ text: intl.formatMessage(messages.unblockDomain, { domain: remoteDomain }), action: this.props.onUnblockDomain });
      } else {
        menu.push({ text: intl.formatMessage(messages.blockDomain, { domain: remoteDomain }), action: this.props.onBlockDomain, dangerous: true });
      }
      if (account.getIn(['relationship', 'domain_muting'])) {
        menu.push({ text: intl.formatMessage(messages.unmuteDomain, { domain: remoteDomain }), action: this.props.onUnmuteDomain });
      } else {
        menu.push({ text: intl.formatMessage(messages.muteDomain, { domain: remoteDomain }), action: this.props.onMuteDomain });
      }
    }

    if (account.get('id') !== me && ((permissions & PERMISSION_MANAGE_USERS) === PERMISSION_MANAGE_USERS && accountAdminLink) || (isRemote && (permissions & PERMISSION_MANAGE_FEDERATION) === PERMISSION_MANAGE_FEDERATION)) {
      menu.push(null);
      if ((permissions & PERMISSION_MANAGE_USERS) === PERMISSION_MANAGE_USERS && accountAdminLink) {
        menu.push({ text: intl.formatMessage(messages.admin_account, { name: account.get('username') }), href: accountAdminLink(account.get('id')) });
      }
      if (isRemote && (permissions & PERMISSION_MANAGE_FEDERATION) === PERMISSION_MANAGE_FEDERATION) {
        menu.push({ text: intl.formatMessage(messages.admin_domain, { domain: remoteDomain }), href: `/admin/instances/${remoteDomain}` });
      }
    }

    const content          = { __html: account.get('note_emojified') };
    const displayNameHtml = { __html: account.get('display_name_html') };
    const isLocal         = account.get('acct').indexOf('@') === -1;
    const acct            = isLocal && domain ? `${account.get('acct')}@${domain}` : account.get('acct');
    const isIndexable     = !account.get('noindex');

    let badge;

    if (account.get('bot')) {
      badge = (<div className='account-role bot'><FormattedMessage id='account.badges.bot' defaultMessage='Automated' /></div>);
    } else if (account.get('group')) {
      badge = (<div className='account-role group'><FormattedMessage id='account.badges.group' defaultMessage='Group' /></div>);
    } else {
      badge = null;
    }

    let role = null;
    if (account.getIn(['roles', 0])) {
      role = (<div key='role' className={`account-role user-role-${account.getIn(['roles', 0, 'id'])}`}>{account.getIn(['roles', 0, 'name'])}</div>);
    }

    return (
      <div className={classNames('account__header', { inactive: !!account.get('moved') })} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
        {!(suspended || hidden || account.get('moved')) && account.getIn(['relationship', 'requested_by']) && <FollowRequestNoteContainer account={account} />}

        <div className='account__header__image'>
          <div className='account__header__info'>
            {info}
          </div>

          {!(suspended || hidden) && <img src={autoPlayGif ? account.get('header') : account.get('header_static')} alt='' className='parallax' />}
        </div>

        <div className='account__header__bar'>

          {!suspended && (
            <div className='account__header__tabs__buttons'>
              <div className='account__header__tabs__buttons__wrapper'>
                {!hidden && (
                  <>
                    {actionBtn}
                    {bellBtn}
                  </>
                )}

                <DropdownMenuContainer disabled={menu.length === 0} items={menu} icon='ellipsis-v' size={1.2} direction='right' />
              </div>
            </div>
          )}

          <div className='account__header__tabs'>
            <a className='avatar' href={account.get('avatar')} rel='noopener noreferrer' target='_blank' onClick={this.handleAvatarClick}>
              <Avatar account={suspended || hidden ? undefined : account} size={150} />
              {role}
              {badge}
            </a>

            <div className='account__header__tabs__name'>
              <h1>
                <span dangerouslySetInnerHTML={displayNameHtml} />
                <small>
                  <span>@{acct}</span> {lockedIcon}
                </small>
              </h1>
            </div>
          </div>

          {signedIn && <AccountNoteContainer account={account} />}

          {!(suspended || hidden) && (
            <div className='account__header__extra'>
              <div className='account__header__bio'>

                {account.get('note').length > 0 && account.get('note') !== '<p></p>' && <div className='account__header__content translate' dangerouslySetInnerHTML={content} />}
                
              </div>
            </div>
          )}
        </div>

        <Helmet>
          <title>{titleFromAccount(account)}</title>
          <meta name='robots' content={(isLocal && isIndexable) ? 'all' : 'noindex'} />
          <link rel='canonical' href={account.get('url')} />
        </Helmet>
      </div>
    );
  }

}

export default injectIntl(Header);
