import * as React from 'react';

import classNames from 'classnames';

interface Props {
  src: string;
  className?: string;
}

export const Wordmark: React.FC<Props> = ({ src, className }) => {
  return (
    <div className={classNames('wordmark_wrapper', className)}>
      <img src={src} alt='' />
    </div>
  );
};
