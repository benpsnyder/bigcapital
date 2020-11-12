import React from 'react';
import { Intent, Button } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import { FormattedMessage as T } from 'react-intl';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import { saveInvoke } from 'utils';

export default function InvoiceFloatingActions({
  isSubmitting,
  onSubmitClick,
  onSubmitAndNewClick,
  onCancelClick,
  onClearClick,
  invoice,
}) {
  const { resetForm } = useFormikContext();

  return (
    <div className={classNames(CLASSES.PAGE_FORM_FLOATING_ACTIONS)}>
      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitClick, event);
        }}
      >
        {invoice && invoice.id ? <T id={'edit'} /> : <T id={'save'} />}
      </Button>

      <Button
        disabled={isSubmitting}
        intent={Intent.PRIMARY}
        className={'ml1'}
        type="submit"
        onClick={(event) => {
          saveInvoke(onSubmitAndNewClick, event);
        }}
      >
        <T id={'save_new'} />
      </Button>

      <Button className={'ml1'} disabled={isSubmitting} onClick={(event) => {
        resetForm();
        saveInvoke(onClearClick, event);
      }}>
        <T id={'clear'} />
      </Button>

      <Button className={'ml1'} type="submit" onClick={(event) => {
        saveInvoke(onCancelClick, event);
      }}>
        <T id={'close'} />
      </Button>
    </div>
  );
}
