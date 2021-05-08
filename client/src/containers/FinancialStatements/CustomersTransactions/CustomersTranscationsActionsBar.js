import React from 'react';
import {
  NavbarGroup,
  Button,
  Classes,
  NavbarDivider,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';

import Icon from 'components/Icon';
import DashboardActionsBar from 'components/Dashboard/DashboardActionsBar';
import NumberFormatDropdown from 'components/NumberFormatDropdown';

import { useCustomersTranscationsContext } from './CustomersTranscationsProvider';
import withCustomersTransactions from './withCustomersTransactions';
import withCustomersTransactionsActions from './withCustomersTransactionsActions';

import { compose, saveInvoke } from 'utils';

/**
 * Customers transcations actions bar.
 */
function CustomersTranscationsActionsBar({
  // #ownProps
  numberFormat,
  onNumberFormatSubmit,

  //#withCustomersTransactions
  isFilterDrawerOpen,

  //#withCustomersTransactionsActions
  toggleCustomersTransactionsFilterDrawer,
}) {
  const {
    isCustomersTransactionsLoading,
    CustomersTransactionsRefetch,
  } = useCustomersTranscationsContext();

  // Handle filter toggle click.
  const handleFilterToggleClick = () => {
    toggleCustomersTransactionsFilterDrawer();
  };

  // Handle recalculate the report button.
  const handleRecalcReport = () => {
    CustomersTransactionsRefetch();
  };

  // Handle number format form submit.
  const handleNumberFormatSubmit = (values) => {
    saveInvoke(onNumberFormatSubmit, values);
  };

  return (
    <DashboardActionsBar>
      <NavbarGroup>
        <Button
          className={classNames(Classes.MINIMAL, 'button--gray-highlight')}
          text={<T id={'recalc_report'} />}
          onClick={handleRecalcReport}
          icon={<Icon icon="refresh-16" iconSize={16} />}
        />
        <NavbarDivider />
        <Button
          className={classNames(Classes.MINIMAL, 'button--table-views')}
          icon={<Icon icon="cog-16" iconSize={16} />}
          text={
            isFilterDrawerOpen ? (
              <T id={'customize_report'} />
            ) : (
              <T id={'hide_customizer'} />
            )
          }
          onClick={handleFilterToggleClick}
          active={isFilterDrawerOpen}
        />
        <NavbarDivider />
        <Popover
          content={
            <NumberFormatDropdown
              numberFormat={numberFormat}
              onSubmit={handleNumberFormatSubmit}
              submitDisabled={isCustomersTransactionsLoading}
            />
          }
          minimal={true}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'format'} />}
            icon={<Icon icon="numbers" width={23} height={16} />}
          />
        </Popover>

        <Popover
          // content={}
          interactionKind={PopoverInteractionKind.CLICK}
          position={Position.BOTTOM_LEFT}
        >
          <Button
            className={classNames(Classes.MINIMAL, 'button--filter')}
            text={<T id={'filter'} />}
            icon={<Icon icon="filter-16" iconSize={16} />}
          />
        </Popover>

        <NavbarDivider />

        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="print-16" iconSize={16} />}
          text={<T id={'print'} />}
        />
        <Button
          className={Classes.MINIMAL}
          icon={<Icon icon="file-export-16" iconSize={16} />}
          text={<T id={'export'} />}
        />
      </NavbarGroup>
    </DashboardActionsBar>
  );
}

export default compose(
  withCustomersTransactions(({ customersTransactionsDrawerFilter }) => ({
    isFilterDrawerOpen: customersTransactionsDrawerFilter,
  })),
  withCustomersTransactionsActions,
)(CustomersTranscationsActionsBar);