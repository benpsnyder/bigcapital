import React from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import {
  Intent,
  Button,
  Popover,
  Menu,
  MenuDivider,
  Tag,
  MenuItem,
  Position,
} from '@blueprintjs/core';
import { safeCallback, firstLettersArgs } from 'utils';
import { Icon, If } from 'components';

/**
 * Avatar cell.
 */
function AvatarCell(row) {
  return <span className={'avatar'}>{firstLettersArgs(row.email)}</span>;
}

/**
 * Users table actions menu.
 */
export function ActionsMenu({
  row: { original },
  payload: { onEdit, onInactivate, onActivate, onDelete, onResendInvitation },
}) {
  const { formatMessage } = useIntl();

  return (
    <Menu>
      <If condition={original.invite_accepted_at}>
        <MenuItem
          icon={<Icon icon="pen-18" />}
          text={formatMessage({ id: 'edit_user' })}
          onClick={safeCallback(onEdit, original)}
        />
        <MenuDivider />

        {original.active ? (
          <MenuItem
            text={formatMessage({ id: 'inactivate_user' })}
            onClick={safeCallback(onInactivate, original)}
            icon={<Icon icon="pause-16" iconSize={16} />}
          />
        ) : (
          <MenuItem
            text={formatMessage({ id: 'activate_user' })}
            onClick={safeCallback(onActivate, original)}
            icon={<Icon icon="play-16" iconSize={16} />}
          />
        )}
      </If>

      <If condition={!original.invite_accepted_at}>
        <MenuItem
          text={'Resend invitation'}
          onClick={safeCallback(onResendInvitation, original)}
          icon={<Icon icon="send" iconSize={16} />}
        />
      </If>

      <MenuItem
        icon={<Icon icon="trash-16" iconSize={16} />}
        text={formatMessage({ id: 'delete_user' })}
        onClick={safeCallback(onDelete, original)}
        intent={Intent.DANGER}
      />
    </Menu>
  );
}

/**
 * Status accessor.
 */
function StatusAccessor(user) {
  return !user.is_invite_accepted ? (
    <Tag minimal={true}>
      <T id={'inviting'} />
    </Tag>
  ) : user.active ? (
    <Tag intent={Intent.SUCCESS} minimal={true}>
      <T id={'activate'} />
    </Tag>
  ) : (
    <Tag intent={Intent.WARNING} minimal={true}>
      <T id={'inactivate'} />
    </Tag>
  );
}

/**
 * Actions cell.
 */
function ActionsCell(props) {
  return (
    <Popover
      content={<ActionsMenu {...props} />}
      position={Position.RIGHT_BOTTOM}
    >
      <Button icon={<Icon icon="more-h-16" iconSize={16} />} />
    </Popover>
  );
}

function FullNameAccessor(user) {
  return user.is_invite_accepted ? user.full_name : user.email;
}

export const useUsersListColumns = () => {
  const { formatMessage } = useIntl();

  return React.useMemo(
    () => [
      {
        id: 'avatar',
        Header: '',
        accessor: AvatarCell,
        width: 40,
      },
      {
        id: 'full_name',
        Header: formatMessage({ id: 'full_name' }),
        accessor: FullNameAccessor,
        width: 150,
      },
      {
        id: 'email',
        Header: formatMessage({ id: 'email' }),
        accessor: 'email',
        width: 150,
      },
      {
        id: 'phone_number',
        Header: formatMessage({ id: 'phone_number' }),
        accessor: 'phone_number',
        width: 120,
      },
      {
        id: 'status',
        Header: 'Status',
        accessor: StatusAccessor,
        width: 80,
        className: 'status',
      },
      {
        id: 'actions',
        Header: '',
        Cell: ActionsCell,
        className: 'actions',
        width: 50,
        disableResizing: true,
      },
    ],
    [formatMessage],
  );
};