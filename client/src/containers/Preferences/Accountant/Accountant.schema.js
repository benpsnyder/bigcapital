import * as Yup from 'yup';

const Schema = Yup.object().shape({
  accounting_basis: Yup.string().required(),
  account_code_required: Yup.boolean(),
  account_code_unique: Yup.boolean(),
  deposit_account: Yup.number().nullable(),
  withdrawal_account: Yup.number().nullable(),
  advance_deposit: Yup.number().nullable(),
});

export const AccountantSchema = Schema;