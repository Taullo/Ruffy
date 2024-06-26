import { connect } from 'react-redux';

import { fetchBundleRequest, fetchBundleSuccess, fetchBundleFail } from 'flavours/aether/actions/bundles';

import Bundle from '../components/bundle';


const mapDispatchToProps = dispatch => ({
  onFetch () {
    dispatch(fetchBundleRequest());
  },
  onFetchSuccess () {
    dispatch(fetchBundleSuccess());
  },
  onFetchFail (error) {
    dispatch(fetchBundleFail(error));
  },
});

export default connect(null, mapDispatchToProps)(Bundle);
