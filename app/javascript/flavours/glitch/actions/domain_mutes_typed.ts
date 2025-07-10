import { createAction } from '@reduxjs/toolkit';

import type { Account } from 'flavours/glitch/models/account';

export const muteDomainSuccess = createAction<{
  domain: string;
  accounts: Account[];
}>('domain_mutes/mute/SUCCESS');

export const unmuteDomainSuccess = createAction<{
  domain: string;
  accounts: Account[];
}>('domain_mutes/unmute/SUCCESS');
