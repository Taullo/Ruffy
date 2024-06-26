import { connect } from 'react-redux';

import { changeColumnParams } from 'flavours/aether/actions/columns';
import api from 'flavours/aether/api';

import ColumnSettings from '../components/column_settings';

const mapStateToProps = (state, { columnId }) => {
  const columns = state.getIn(['settings', 'columns']);
  const index   = columns.findIndex(c => c.get('uuid') === columnId);

  if (!(columnId && index >= 0)) {
    return {};
  }

  return {
    settings: columns.get(index).get('params'),
    onLoad (value) {
      return api(() => state).get('/api/v2/search', { params: { q: value, type: 'hashtags' } }).then(response => {
        return (response.data.hashtags || []).map((tag) => {
          return { value: tag.name, label: `#${tag.name}` };
        });
      });
    },
  };
};

const mapDispatchToProps = (dispatch, { columnId }) => ({
  onChange (key, value) {
    dispatch(changeColumnParams(columnId, key, value));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ColumnSettings);
