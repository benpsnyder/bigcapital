import intl from 'react-intl-universal';
import React from 'react';
import { Classes, Tooltip, Position } from '@blueprintjs/core';

import { FormatNumberCell, If, Icon } from '../../../components';

/**
 * Note column accessor.
 */
export function NoteAccessor(row) {
  return (
    <If condition={row.note}>
      <Tooltip
        className={Classes.TOOLTIP_INDICATOR}
        content={row.note}
        position={Position.LEFT_TOP}
        hoverOpenDelay={50}
      >
        <Icon icon={'file-alt'} iconSize={16} />
      </Tooltip>
    </If>
  );
}

/**
 * Retrieve cashflow transaction entries columns.
 */
export const useCashflowTransactionColumns = () =>
  React.useMemo(
    () => [
      {
        Header: intl.get('account_name'),
        accessor: 'account.name',
        width: 130,
        disableSortBy: true,
        className: 'account',
      },
      {
        Header: intl.get('contact'),
        accessor: 'contact.display_name',
        width: 130,
        disableSortBy: true,
        className: 'contact',
      },
      {
        Header: intl.get('note'),
        accessor: NoteAccessor,
        width: 80,
        disableSortBy: true,
        className: 'note',
      },
      {
        Header: intl.get('credit'),
        accessor: 'credit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'credit',
        align: 'right',
      },
      {
        Header: intl.get('debit'),
        accessor: 'debit',
        Cell: FormatNumberCell,
        width: 100,
        disableResizable: true,
        disableSortBy: true,
        formatNumber: { noZero: true },
        className: 'debit',
        align: 'right',
      },
    ],
    [],
  );