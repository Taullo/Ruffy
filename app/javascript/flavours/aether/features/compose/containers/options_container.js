import { connect } from 'react-redux';

import {
  changeComposeAdvancedOption,
  changeComposeContentType,
  addPoll,
  removePoll,
} from 'flavours/aether/actions/compose';
import { openModal, closeModal } from 'flavours/aether/actions/modal';

import Options from '../components/options';

function mapStateToProps (state) {
  const poll = state.getIn(['compose', 'poll']);
  const media = state.getIn(['compose', 'media_attachments']);
  const pending_media = state.getIn(['compose', 'pending_media_attachments']);
  return {
    acceptContentTypes: state.getIn(['media_attachments', 'accept_content_types']).toArray().join(','),
    resetFileKey: state.getIn(['compose', 'resetFileKey']),
    hasPoll: !!poll,
    allowMedia: !poll && (media ? media.size + pending_media < 20 && !media.some(item => ['video', 'audio'].includes(item.get('type'))) : pending_media < 20),
    allowPoll: !(media && !!media.size),
    showContentTypeChoice: state.getIn(['local_settings', 'show_content_type_choice']),
    contentType: state.getIn(['compose', 'content_type']),
  };
}

const mapDispatchToProps = (dispatch) => ({

  onChangeAdvancedOption(option, value) {
    dispatch(changeComposeAdvancedOption(option, value));
  },

  onChangeContentType(value) {
    dispatch(changeComposeContentType(value));
  },

  onTogglePoll() {
    dispatch((_, getState) => {
      if (getState().getIn(['compose', 'poll'])) {
        dispatch(removePoll());
      } else {
        dispatch(addPoll());
      }
    });
  },

  onDoodleOpen() {
    dispatch(openModal({
      modalType: 'DOODLE',
      modalProps: { noEsc: true, noClose: true },
    }));
  },

  onEmbedTenor() {
    dispatch(openModal({
      modalType: 'TENOR',
      modalProps: { noEsc: true },
    }));
  },

  onModalClose() {
    dispatch(closeModal({
      modalType: undefined,
      ignoreFocus: false,
    }));
  },

  onModalOpen(props) {
    dispatch(openModal({ modalType: 'ACTIONS', modalProps: props }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Options);
