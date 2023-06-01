//  Package imports.
import { connect } from 'react-redux';

//  Our imports.
import { makeGetNotification } from 'flavours/aether/selectors';
import Notification from '../components/notification';
import { mentionCompose } from 'flavours/aether/actions/compose';

const makeMapStateToProps = () => {
  const getNotification = makeGetNotification();

  const mapStateToProps = (state, props) => ({
    notification: getNotification(state, props.notification, props.accountId),
    notifCleaning: state.getIn(['notifications', 'cleaningMode']),
  });

  return mapStateToProps;
};

const mapDispatchToProps = dispatch => ({
  onMention: (account, router) => {
    dispatch(mentionCompose(account, router));
  },
});

export default connect(makeMapStateToProps, mapDispatchToProps)(Notification);
