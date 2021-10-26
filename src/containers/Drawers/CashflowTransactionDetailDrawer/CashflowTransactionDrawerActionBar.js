import React from 'react';
import Icon from 'components/Icon';
import { Button, Classes, NavbarGroup, Intent } from '@blueprintjs/core';
import { FormattedMessage as T } from 'components';

import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import { useCashflowTransactionDrawerContext } from './CashflowTransactionDrawerProvider';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Cashflow transaction drawer action bar.
 */
function CashflowTransactionDrawerActionBar({
  // #withAlertsDialog
  openAlert,
}) {
  const { referenceId } = useCashflowTransactionDrawerContext();

  // Handle cashflow transaction delete action.
  const handleDeleteCashflowTransaction = () => {
    openAlert('account-transaction-delete', { referenceId });
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="trash-16" iconSize={16} />}
          text={<T id={'delete'} />}
          intent={Intent.DANGER}
          onClick={handleDeleteCashflowTransaction}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}
export default compose(withAlertsActions)(CashflowTransactionDrawerActionBar);