import { connect } from 'react-redux';

import { openDropdownMenu, closeDropdownMenu } from 'flavours/aether/actions/dropdown_menu';
import { openModal, closeModal } from 'flavours/aether/actions/modal';
import DropdownMenu from 'flavours/aether/components/dropdown_menu';

import { isUserTouching } from '../is_mobile';

/**
 * @param {import('flavours/aether/store').RootState} state
 */
const mapStateToProps = state => ({
  openDropdownId: state.dropdownMenu.openId,
  openedViaKeyboard: state.dropdownMenu.keyboard,
});

const mapDispatchToProps = (dispatch, { status, items, scrollKey }) => ({
  onOpen(id, onItemClick, keyboard) {
    dispatch(isUserTouching() ? openModal({
      modalType: 'ACTIONS',
      modalProps: {
        status,
        actions: items,
        onClick: onItemClick,
      },
    }) : openDropdownMenu({ id, keyboard, scrollKey }));
  },

  onClose(id) {
    dispatch(closeModal({
      modalType: 'ACTIONS',
      ignoreFocus: false,
    }));
    dispatch(closeDropdownMenu({ id }));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DropdownMenu);
