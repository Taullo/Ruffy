import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ImmutableHashtag as Hashtag } from 'flavours/aether/components/hashtag';
import LoadingIndicator from 'flavours/aether/components/loading_indicator';
import { connect } from 'react-redux';
import { fetchTrendingHashtags } from 'flavours/aether/actions/trends';
import { FormattedMessage } from 'react-intl';
import DismissableBanner from 'flavours/aether/components/dismissable_banner';

const mapStateToProps = state => ({
  hashtags: state.getIn(['trends', 'tags', 'items']),
  isLoadingHashtags: state.getIn(['trends', 'tags', 'isLoading']),
});

class Tags extends React.PureComponent {

  static propTypes = {
    hashtags: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchTrendingHashtags());
  }

  render () {
    const { isLoading, hashtags } = this.props;

    if (!isLoading && hashtags.isEmpty()) {
      return (
        <div className='explore__links scrollable scrollable--flex'>

          <div className='empty-column-indicator'>
            <FormattedMessage id='empty_column.explore_tags' defaultMessage='There are no trending hashtags yet. Check back later!' />
          </div>
        </div>
      );
    }

    return (
      <div className='explore__links'>

        {isLoading ? (<LoadingIndicator />) : hashtags.map(hashtag => (
          <Hashtag key={hashtag.get('name')} hashtag={hashtag} />
        ))}
      </div>
    );
  }

}

export default connect(mapStateToProps)(Tags);
