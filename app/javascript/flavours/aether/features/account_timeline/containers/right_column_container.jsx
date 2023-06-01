import React from 'react';
import { connect } from 'react-redux';
import { makeGetAccount, getAccountHidden } from 'flavours/aether/selectors';
import RightColumn from '../components/right_column';
import { initMuteModal } from 'flavours/aether/actions/mutes';
import { initBlockModal } from 'flavours/aether/actions/blocks';
import { initReport } from 'flavours/aether/actions/reports';
import { openModal } from 'flavours/aether/actions/modal';
import { blockDomain, unblockDomain } from 'flavours/aether/actions/domain_blocks';
import { initEditAccountNote } from 'flavours/aether/actions/account_notes';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { unfollowModal } from 'flavours/aether/initial_state';

const messages = defineMessages({
  cancelFollowRequestConfirm: { id: 'confirmations.cancel_follow_request.confirm', defaultMessage: 'Withdraw request' },
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    domain: state.getIn(['meta', 'domain']),
    hidden: getAccountHidden(state, accountId),
  });

  return mapStateToProps;
};

export default injectIntl(connect(makeMapStateToProps)(RightColumn));
