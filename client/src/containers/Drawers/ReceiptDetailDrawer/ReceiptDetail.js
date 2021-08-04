import React from 'react';
import { Tabs, Tab } from '@blueprintjs/core';
import intl from 'react-intl-universal';

import JournalEntriesTable from '../../JournalEntriesTable/JournalEntriesTable';
import { useReceiptDetailDrawerContext } from './ReceiptDetailDrawerProvider';

/**
 * Receipt view detail.
 */
export default function ReceiptDetail() {
  const { transactions } = useReceiptDetailDrawerContext();

  return (
    <div className="view-detail-drawer">
      <Tabs animate={true} large={true} defaultSelectedTabId="journal_entries">
        <Tab title={intl.get('details')} id={'details'} disabled={true} />
        <Tab
          title={intl.get('journal_entries')}
          id={'journal_entries'}
          panel={<JournalEntriesTable transactions={transactions} />}
        />
      </Tabs>
    </div>
  );
}