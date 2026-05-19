import type * as React from 'react';

import classNames from 'classnames';

import { useAppSelector } from 'flavours/glitch/store';

interface Props {
  className?: string;
}

export const Wordmark: React.FC<Props> = ({ className }) => {
  const WordmarkURL = useAppSelector(
    (state) => state.server.getIn(['server', 'wordmark', 'url']) as string,
  );

  const WordmarkDarkURL = useAppSelector(
    (state) => state.server.getIn(['server', 'wordmark_dark', 'url']) as string,
  );
  return (
    <div className={classNames('wordmark_wrapper', className)}>
      <img className='wordmark-image' src={WordmarkURL} alt='' />
      <img className='wordmark-image-dark' src={WordmarkDarkURL} alt='' />
    </div>
  );
};
