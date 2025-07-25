import { isFulfilled } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';
import { Map as ImmutableMap } from 'immutable';

import type { ApiRelationshipJSON } from 'flavours/glitch/api_types/relationships';
import type { Account } from 'flavours/glitch/models/account';
import { createRelationship } from 'flavours/glitch/models/relationship';
import type { Relationship } from 'flavours/glitch/models/relationship';

import { submitAccountNote } from '../actions/account_notes';
import {
  followAccountSuccess,
  unfollowAccountSuccess,
  authorizeFollowRequestSuccess,
  rejectFollowRequestSuccess,
  followAccountRequest,
  followAccountFail,
  unfollowAccountRequest,
  unfollowAccountFail,
  blockAccountSuccess,
  unblockAccountSuccess,
  muteAccountSuccess,
  unmuteAccountSuccess,
  pinAccountSuccess,
  unpinAccountSuccess,
  fetchRelationshipsSuccess,
  removeAccountFromFollowers,
} from '../actions/accounts_typed';
import {
  blockDomainSuccess,
  unblockDomainSuccess,
} from '../actions/domain_blocks_typed';
import {
  muteDomainSuccess,
  unmuteDomainSuccess,
} from '../actions/domain_mutes_typed';
import { notificationsUpdate } from '../actions/notifications_typed';

const initialState = ImmutableMap<string, Relationship>();
type State = typeof initialState;

const normalizeRelationship = (
  state: State,
  relationship: ApiRelationshipJSON,
) => state.set(relationship.id, createRelationship(relationship));

const normalizeRelationships = (
  state: State,
  relationships: ApiRelationshipJSON[],
) => {
  relationships.forEach((relationship) => {
    state = normalizeRelationship(state, relationship);
  });

  return state;
};

const setDomainBlocking = (
  state: State,
  accounts: Account[],
  blocking: boolean,
) => {
  return state.withMutations((map) => {
    accounts.forEach((id) => {
      map.setIn([id, 'domain_blocking'], blocking);
    });
  });
};

const setDomainMuting = (
  state: State,
  accounts: Account[],
  blocking: boolean,
) => {
  return state.withMutations((map) => {
    accounts.forEach((id) => {
      map.setIn([id, 'domain_muting'], blocking);
    });
  });
};

export const relationshipsReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  if (authorizeFollowRequestSuccess.match(action))
    return state
      .setIn([action.payload.id, 'followed_by'], true)
      .setIn([action.payload.id, 'requested_by'], false);
  else if (rejectFollowRequestSuccess.match(action))
    return state
      .setIn([action.payload.id, 'followed_by'], false)
      .setIn([action.payload.id, 'requested_by'], false);
  else if (notificationsUpdate.match(action))
    return action.payload.notification.type === 'follow_request'
      ? state.setIn(
          [action.payload.notification.account.id, 'requested_by'],
          true,
        )
      : state;
  else if (followAccountRequest.match(action))
    return state.getIn([action.payload.id, 'following'])
      ? state
      : state.setIn(
          [
            action.payload.id,
            action.payload.locked ? 'requested' : 'following',
          ],
          true,
        );
  else if (followAccountFail.match(action))
    return state.setIn(
      [action.payload.id, action.payload.locked ? 'requested' : 'following'],
      false,
    );
  else if (unfollowAccountRequest.match(action))
    return state.setIn([action.payload.id, 'following'], false);
  else if (unfollowAccountFail.match(action))
    return state.setIn([action.payload.id, 'following'], true);
  else if (
    followAccountSuccess.match(action) ||
    unfollowAccountSuccess.match(action) ||
    blockAccountSuccess.match(action) ||
    unblockAccountSuccess.match(action) ||
    muteAccountSuccess.match(action) ||
    unmuteAccountSuccess.match(action) ||
    pinAccountSuccess.match(action) ||
    unpinAccountSuccess.match(action) ||
    isFulfilled(submitAccountNote)(action) ||
    isFulfilled(removeAccountFromFollowers)(action)
  )
    return normalizeRelationship(state, action.payload.relationship);
  else if (fetchRelationshipsSuccess.match(action))
    return normalizeRelationships(state, action.payload.relationships);
  else if (blockDomainSuccess.match(action))
    return setDomainBlocking(state, action.payload.accounts, true);
  else if (unblockDomainSuccess.match(action))
    return setDomainBlocking(state, action.payload.accounts, false);
  else if (muteDomainSuccess.match(action))
    return setDomainMuting(state, action.payload.accounts, true);
  else if (unmuteDomainSuccess.match(action))
    return setDomainMuting(state, action.payload.accounts, false);
  else return state;
};
