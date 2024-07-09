import PropTypes from 'prop-types';
import { Component } from 'react';

export default class IntersectionObserverArticle extends Component {

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    listLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.node,
  };

  componentDidMount () {
    this.componentMounted = true;
  }

  componentWillUnmount () {
    this.componentMounted = false;
  }

  handleRef = (node) => {
    this.node = node;
  };

  render () {
    const { children, id, index, listLength } = this.props;

    return (
      <article
        ref={this.handleRef}
        aria-posinset={index + 1}
        aria-setsize={listLength}
        data-id={id}
        tabIndex={0}
      >
        {children}
      </article>
    );
  }

}
