import React from 'react';
import ComposeFormContainer from 'flavours/aether/features/compose/containers/compose_form_container';
import NotificationsContainer from 'flavours/aether/features/ui/containers/notifications_container';
import LoadingBarContainer from 'flavours/aether/features/ui/containers/loading_bar_container';
import ModalContainer from 'flavours/aether/features/ui/containers/modal_container';

export default class Compose extends React.PureComponent {

  render () {
    return (
      <div>
        <ComposeFormContainer autoFocus />
        <NotificationsContainer />
        <ModalContainer />
        <LoadingBarContainer className='loading-bar' />
      </div>
    );
  }

}
