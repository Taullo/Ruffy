//  Package imports.
import PropTypes from 'prop-types';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';

//  Components.
import { Icon } from 'flavours/aether/components/icon';
//  Messages.
const messages = defineMessages({
  localOnly: {
    defaultMessage: 'This post is local-only',
    id: 'advanced_options.local-only.tooltip',
  },
});

//  We use an array of tuples here instead of an object because it
//  preserves order.
const iconMap = [
  ['do_not_federate', 'home', messages.localOnly],
];

class TextareaIcons extends ImmutablePureComponent {

  static propTypes = {
    advancedOptions: ImmutablePropTypes.map,
    intl: PropTypes.object.isRequired,
  };

  render () {
    const { advancedOptions, intl } = this.props;
    return (
      <div className='compose-form__textarea-icons'>
        {advancedOptions ? iconMap.map(
          ([key, icon, message]) => advancedOptions.get(key) ? (
            <span
              className='textarea_icon'
              key={key}
              title={intl.formatMessage(message)}
            >
              <Icon
                fixedWidth
                id={icon}
              />
            </span>
          ) : null,
        ) : null}
      </div>
    );
  }

}

export default injectIntl(TextareaIcons);
