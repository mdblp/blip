/**
 * Copyright (c) 2020, Diabeloop
 * Models for profile page
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

export interface SwitchRoleDialogProps {
  title?: string;
  open: boolean;
  onResult: (accept: boolean) => void;
}

export interface SwitchRoleConsequencesDialogProps extends SwitchRoleDialogProps {
  title: string;
}

export interface SwitchRoleDialogsProps {
  open: boolean;
  onCancel: () => void;
}

export enum SwitchRoleToHcpSteps {
  none,
  consequences,
  consent,
  update, // Update in progress => backend API call
}
