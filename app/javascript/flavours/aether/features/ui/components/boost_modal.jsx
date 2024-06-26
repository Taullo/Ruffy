import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { changeBoostPrivacy } from 'flavours/aether/actions/boosts';
import AttachmentList from 'flavours/aether/components/attachment_list';
import { Avatar } from 'flavours/aether/components/avatar';
import Button from 'flavours/aether/components/button';
import { DisplayName } from 'flavours/aether/components/display_name';
import { Icon } from 'flavours/aether/components/icon';
import { RelativeTimestamp } from 'flavours/aether/components/relative_timestamp';
import StatusContent from 'flavours/aether/components/status_content';
import VisibilityIcon from 'flavours/aether/components/status_visibility_icon';
import PrivacyDropdown from 'flavours/aether/features/compose/components/privacy_dropdown';

const messages = defineMessages({
  cancel_reblog: { id: 'status.cancel_reblog_private', defaultMessage: 'Unboost' },
  reblog: { id: 'status.reblog', defaultMessage: 'Boost' },
});

const mapStateToProps = state => {
  return {
    privacy: state.getIn(['boosts', 'new', 'privacy']),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeBoostPrivacy(value) {
      dispatch(changeBoostPrivacy(value));
    },
  };
};

class BoostModal extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    onReblog: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    missingMediaDescription: PropTypes.bool,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.button.focus();
  }

  handleReblog = () => {
    this.props.onReblog(this.props.status, this.props.privacy);
    this.props.onClose();
  };

  handleAccountClick = (e) => {
    if (e.button === 0) {
      e.preventDefault();
      this.props.onClose();
      this.context.router.history.push(`/@${this.props.status.getIn(['account', 'acct'])}`);
    }
  };

  _findContainer = () => {
    return document.getElementsByClassName('modal-root__container')[0];
  };

  setRef = (c) => {
    this.button = c;
  };

  render () {
    const { status, missingMediaDescription, privacy, intl } = this.props;
    const buttonText = status.get('reblogged') ? messages.cancel_reblog : messages.reblog;

    return (
      <div className='modal-root__modal boost-modal'>
        <div className='boost-modal__container'>
          <div className={classNames('status', `status-${status.get('visibility')}`, 'light')}>
            <div className='boost-modal__status-header'>
              <div className='boost-modal__status-time'>
                <a href={status.get('url')} className='status__relative-time' target='_blank' rel='noopener noreferrer'>
                  <VisibilityIcon visibility={status.get('visibility')} />
                  <RelativeTimestamp timestamp={status.get('created_at')} /></a>
              </div>

              <a onClick={this.handleAccountClick} href={status.getIn(['account', 'url'])} className='status__display-name'>
                <div className='status__avatar'>
                  <Avatar account={status.get('account')} size={48} />
                </div>

                <DisplayName account={status.get('account')} />
              </a>
            </div>

            <StatusContent status={status} />

            {status.get('media_attachments').size > 0 && (
              <AttachmentList
                compact
                media={status.get('media_attachments')}
              />
            )}
          </div>
        </div>

        <div className='boost-modal__action-bar'>
          <div>
            { missingMediaDescription ?
              <FormattedMessage id='boost_modal.missing_description' defaultMessage='This toot contains some media without description' />
              :
              <FormattedMessage id='boost_modal.combo' defaultMessage='You can press {combo} to skip this next time' values={{ combo: <span>Shift + <Icon id='retweet' /></span> }} />
            }
          </div>

          {status.get('visibility') !== 'private' && !status.get('reblogged') && (
            <PrivacyDropdown
              noDirect
              value={privacy}
              container={this._findContainer}
              onChange={this.props.onChangeBoostPrivacy}
            />
          )}
          <Button text={intl.formatMessage(buttonText)} onClick={this.handleReblog} ref={this.setRef} />
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BoostModal));
