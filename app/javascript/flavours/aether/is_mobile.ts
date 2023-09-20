import { supportsPassiveEvents } from 'detect-passive-events';

// import { forceSingleColumn } from 'flavours/aether/initial_state';

const LAYOUT_BREAKPOINT = 630;

export const isMobile = (width: number) => width <= LAYOUT_BREAKPOINT;

export type LayoutType = 'mobile' | 'normal' | 'advanced';
export const layoutFromWindow = (layout_local_setting: string): LayoutType => {
  switch (layout_local_setting) {
    case 'advanced':
      return 'advanced';
    case 'normal':
      if (isMobile(window.innerWidth)) {
        return 'mobile';
      } else {
        return 'normal';
      }
    default:
      if (isMobile(window.innerWidth)) {
        return 'mobile';
      } else {
        return 'normal';
      }
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
