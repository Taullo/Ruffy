import PropTypes from 'prop-types';

import { defineMessages, injectIntl , FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import { initBoostModal } from 'flavours/aether/actions/boosts';
import { replyCompose } from 'flavours/aether/actions/compose';
import { reblog, favourite, unreblog, unfavourite } from 'flavours/aether/actions/interactions';
import { openModal } from 'flavours/aether/actions/modal';
import { boostModal } from 'flavours/aether/initial_state';
import { makeGetStatus } from 'flavours/aether/selectors';

const messages = defineMessages({
  reply: { id: 'status.reply', defaultMessage: 'Reply' },
  replyAll: { id: 'status.replyAll', defaultMessage: 'Reply to thread' },
  reblog: { id: 'status.reblog', defaultMessage: 'Boost' },
  reblog_private: { id: 'status.reblog_private', defaultMessage: 'Boost with original visibility' },
  cancel_reblog_private: { id: 'status.cancel_reblog_private', defaultMessage: 'Unboost' },
  cannot_reblog: { id: 'status.cannot_reblog', defaultMessage: 'This post cannot be boosted' },
  favourite: { id: 'status.favourite', defaultMessage: 'Favorite' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  open: { id: 'status.open', defaultMessage: 'Expand this status' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, { statusId }) => ({
    status: getStatus(state, { id: statusId }),
    askReplyConfirmation: state.getIn(['compose', 'text']).trim().length !== 0,
  });

  return mapStateToProps;
};

class Footer extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
    identity: PropTypes.object,
  };

  static propTypes = {
    statusId: PropTypes.string.isRequired,
    status: ImmutablePropTypes.map.isRequired,
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    askReplyConfirmation: PropTypes.bool,
    withOpenButton: PropTypes.bool,
    onClose: PropTypes.func,
  };

  _performReply = () => {
    const { dispatch, status, onClose } = this.props;
    const { router } = this.context;

    if (onClose) {
      onClose(true);
    }

    dispatch(replyCompose(status, router.history));
  };

  handleReplyClick = () => {
    const { dispatch, askReplyConfirmation, status, intl } = this.props;
    const { signedIn } = this.context.identity;

    if (signedIn) {
      if (askReplyConfirmation) {
        dispatch(openModal({
          modalType: 'CONFIRM',
          modalProps: {
            message: intl.formatMessage(messages.replyMessage),
            confirm: intl.formatMessage(messages.replyConfirm),
            onConfirm: this._performReply,
          },
        }));
      } else {
        this._performReply();
      }
    } else {
      dispatch(openModal({
        modalType: 'INTERACTION',
        modalProps: {
          type: 'reply',
          accountId: status.getIn(['account', 'id']),
          url: status.get('uri'),
        },
      }));
    }
  };

  handleFavouriteClick = () => {
    const { dispatch, status } = this.props;
    const { signedIn } = this.context.identity;

    if (signedIn) {
      if (status.get('favourited')) {
        dispatch(unfavourite(status));
      } else {
        dispatch(favourite(status));
      }
    } else {
      dispatch(openModal({
        modalType: 'INTERACTION',
        modalProps: {
          type: 'favourite',
          accountId: status.getIn(['account', 'id']),
          url: status.get('uri'),
        },
      }));
    }
  };

  _performReblog = (privacy) => {
    const { dispatch, status } = this.props;
    dispatch(reblog(status, privacy));
  };

  handleReblogClick = e => {
    const { dispatch, status } = this.props;
    const { signedIn } = this.context.identity;

    if (signedIn) {
      if (status.get('reblogged')) {
        dispatch(unreblog(status));
      } else if ((e && e.shiftKey) || !boostModal) {
        this._performReblog();
      } else {
        dispatch(initBoostModal({ status, onReblog: this._performReblog }));
      }
    } else {
      dispatch(openModal({
        modalType: 'INTERACTION',
        modalProps: {
          type: 'reblog',
          accountId: status.getIn(['account', 'id']),
          url: status.get('uri'),
        },
      }));
    }
  };

  handleOpenClick = e => {
    const { router } = this.context;

    if (e.button !== 0 || !router) {
      return;
    }

    const { status, onClose } = this.props;

    if (onClose) {
      onClose();
    }

    router.history.push(`/@${status.getIn(['account', 'acct'])}/${status.get('id')}`);
  };

  render () {
    const { status, intl, withOpenButton } = this.props;

    return (
      <div className='picture-in-picture__footer'>
        {withOpenButton && <button className='button' title={intl.formatMessage(messages.open)} onClick={this.handleOpenClick} href={status.get('url')}><FormattedMessage id='messages.open' defaultMessage='Expand this post' /> <i className='fa fa-external-link fa-fw' /></button>}
      </div>
    );
  }

}

export default connect(makeMapStateToProps)(injectIntl(Footer));
