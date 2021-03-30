import React, { useMemo } from 'react';
import {
  FormGroup,
  InputGroup,
  Position,
  ControlGroup,
  Button,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import { FormattedMessage as T } from 'react-intl';
import { FastField, Field, useFormikContext, ErrorMessage } from 'formik';

import { useAutofocus } from 'hooks';
import { CLASSES } from 'common/classes';
import classNames from 'classnames';
import {
  compose,
  safeSumBy,
  momentFormatter,
  tansformDateValue,
  handleDateChange,
  inputIntent,
} from 'utils';
import {
  AccountsSelectList,
  ContactSelecetList,
  FieldRequiredHint,
  Icon,
  InputPrependButton,
  MoneyInputGroup,
  InputPrependText,
  Hint,
  Money,
} from 'components';
import { usePaymentReceiveFormContext } from './PaymentReceiveFormProvider';
import { ACCOUNT_TYPE } from 'common/accountTypes';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';

import {
  useObservePaymentNoSettings,
  amountPaymentEntries,
  fullAmountPaymentEntries,
} from './utils';
import { toSafeInteger } from 'lodash';

/**
 * Payment receive header fields.
 */
function PaymentReceiveHeaderFields({
  baseCurrency,

  // #withDialogActions
  openDialog,

  // #withSettings
  paymentReceiveAutoIncrement,
  paymentReceiveNumberPrefix,
  paymentReceiveNextNumber,
}) {
  // Payment receive form context.
  const { customers, accounts, isNewMode } = usePaymentReceiveFormContext();

  // Formik form context.
  const {
    values: { entries },
    setFieldValue,
  } = useFormikContext();

  const customerFieldRef = useAutofocus();

  // Calculates the full-amount received.
  const totalDueAmount = useMemo(() => safeSumBy(entries, 'due_amount'), [
    entries,
  ]);
  // Handle receive full-amount link click.
  const handleReceiveFullAmountClick = () => {
    const newEntries = fullAmountPaymentEntries(entries);
    const fullAmount = safeSumBy(newEntries, 'payment_amount');

    setFieldValue('entries', newEntries);
    setFieldValue('full_amount', fullAmount);
  };
  // Handles the full-amount field blur.
  const onFullAmountBlur = (value) => {
    const newEntries = amountPaymentEntries(toSafeInteger(value), entries);
    setFieldValue('entries', newEntries);
  };
  // Handle click open payment receive number dialog.
  const handleClickOpenDialog = () => {
    openDialog('payment-receive-number-form');
  };

  // Handle payment number field blur.
  const handlePaymentNoBlur = (form, field) => (event) => {
    const newValue = event.target.value;

    if (field.value !== newValue && paymentReceiveAutoIncrement) {
      openDialog('payment-receive-number-form', {
        initialFormValues: {
          manualTransactionNo: newValue,
          incrementMode: 'manual-transaction',
        },
      });
    }
  };

  // Syncs payment receive number from settings to the form.
  useObservePaymentNoSettings(
    paymentReceiveNumberPrefix,
    paymentReceiveNextNumber,
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_FIELDS)}>
      {/* ------------- Customer name ------------- */}
      <FastField name={'customer_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'customer_name'} />}
            inline={true}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'customer_id'} />}
          >
            <ContactSelecetList
              contactsList={customers}
              selectedContactId={value}
              defaultSelectText={<T id={'select_customer_account'} />}
              onContactSelected={(customer) => {
                form.setFieldValue('customer_id', customer.id);
                form.setFieldValue('full_amount', '');
              }}
              popoverFill={true}
              disabled={!isNewMode}
              buttonProps={{
                elementRef: (ref) => (customerFieldRef.current = ref),
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------- Payment date ------------- */}
      <FastField name={'payment_date'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_date'} />}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            className={classNames('form-group--select-list', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_date" />}
          >
            <DateInput
              {...momentFormatter('YYYY/MM/DD')}
              value={tansformDateValue(value)}
              onChange={handleDateChange((formattedDate) => {
                form.setFieldValue('payment_date', formattedDate);
              })}
              popoverProps={{ position: Position.BOTTOM, minimal: true }}
              inputProps={{
                leftIcon: <Icon icon={'date-range'} />,
              }}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Full amount ------------ */}
      <Field name={'full_amount'}>
        {({
          form: { setFieldValue },
          field: { value, onChange },
          meta: { error, touched },
        }) => (
          <FormGroup
            label={<T id={'full_amount'} />}
            inline={true}
            className={('form-group--full-amount', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            labelInfo={<Hint />}
            helperText={<ErrorMessage name="full_amount" />}
          >
            <ControlGroup>
              <InputPrependText text={baseCurrency} />
              <MoneyInputGroup
                value={value}
                onChange={(value) => {
                  setFieldValue('full_amount', value);
                }}
                onBlurValue={onFullAmountBlur}
              />
            </ControlGroup>

            <Button
              onClick={handleReceiveFullAmountClick}
              className={'receive-full-amount'}
              small={true}
              minimal={true}
            >
              Receive full amount (
              <Money amount={totalDueAmount} currency={baseCurrency} />)
            </Button>
          </FormGroup>
        )}
      </Field>

      {/* ------------ Payment receive no. ------------ */}
      <FastField name={'payment_receive_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'payment_receive_no'} />}
            inline={true}
            className={('form-group--payment_receive_no', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="payment_receive_no" />}
          >
            <ControlGroup fill={true}>
              <InputGroup
                intent={inputIntent({ error, touched })}
                minimal={true}
                value={field.value}
                asyncControl={true}
                onBlur={handlePaymentNoBlur(form, field)}
              />
              <InputPrependButton
                buttonProps={{
                  onClick: handleClickOpenDialog,
                  icon: <Icon icon={'settings-18'} />,
                }}
                tooltip={true}
                tooltipProps={{
                  content: 'Setting your auto-generated Payment Receive number',
                  position: Position.BOTTOM_LEFT,
                }}
              />
            </ControlGroup>
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Deposit account ------------ */}
      <FastField name={'deposit_account_id'}>
        {({ form, field: { value }, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'deposit_to'} />}
            className={classNames(
              'form-group--deposit_account_id',
              'form-group--select-list',
              CLASSES.FILL,
            )}
            inline={true}
            labelInfo={<FieldRequiredHint />}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name={'deposit_account_id'} />}
          >
            <AccountsSelectList
              accounts={accounts}
              labelInfo={<FieldRequiredHint />}
              onAccountSelected={(account) => {
                form.setFieldValue('deposit_account_id', account.id);
              }}
              defaultSelectText={<T id={'select_deposit_account'} />}
              selectedAccountId={value}
              filterByTypes={[
                ACCOUNT_TYPE.CASH,
                ACCOUNT_TYPE.BANK,
                ACCOUNT_TYPE.OTHER_CURRENT_ASSET,
              ]}
            />
          </FormGroup>
        )}
      </FastField>

      {/* ------------ Reference No. ------------ */}
      <FastField name={'reference_no'}>
        {({ form, field, meta: { error, touched } }) => (
          <FormGroup
            label={<T id={'reference'} />}
            inline={true}
            className={classNames('form-group--reference', CLASSES.FILL)}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="reference" />}
          >
            <InputGroup
              intent={inputIntent({ error, touched })}
              minimal={true}
              {...field}
            />
          </FormGroup>
        )}
      </FastField>
    </div>
  );
}

export default compose(
  withSettings(({ organizationSettings, paymentReceiveSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
    paymentReceiveNextNumber: paymentReceiveSettings?.nextNumber,
    paymentReceiveNumberPrefix: paymentReceiveSettings?.numberPrefix,
    paymentReceiveAutoIncrement: paymentReceiveSettings?.autoIncrement,
  })),
  withDialogActions,
)(PaymentReceiveHeaderFields);
