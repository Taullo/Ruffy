import { connect } from 'react-redux';
import { makeGetAccount } from 'flavours/aether/selectors';
import FollowRequest from '../components/follow_request';
import { authorizeFollowRequest, rejectFollowRequest } from 'flavours/aether/actions/accounts';

const mapDispatchToProps = (dispatch, { account }) => ({
  onAuthorize () {
    dispatch(authorizeFollowRequest(account.get('id')));
  },

  onReject () {
    dispatch(rejectFollowRequest(account.get('id')));
  },
});

export default connect(null, mapDispatchToProps)(FollowRequest);
