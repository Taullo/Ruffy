import { supportsPassiveEvents } from 'detect-passive-events';

const LAYOUT_BREAKPOINT = 630;

export const isMobile = (width: number) => width <= LAYOUT_BREAKPOINT;

export type LayoutType = 'mobile' | 'single-column' | 'multi-column';
export const layoutFromWindow = (): LayoutType => {
  if (isMobile(window.innerWidth)) {
    return 'mobile';
  } else {
    return 'single-column';
  }
};

const listenerOptions = supportsPassiveEvents ? { passive: true } : false;

let userTouching = false;

const touchListener = () => {
  userTouching = true;

  window.removeEventListener('touchstart', touchListener);
};

window.addEventListener('touchstart', touchListener, listenerOptions);

export const isUserTouching = () => userTouching;
