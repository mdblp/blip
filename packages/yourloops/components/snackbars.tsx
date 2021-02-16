/**
 * Copyright (c) 2021, Diabeloop
 * Snackbars file
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
export enum AlertSeverity {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

interface ApiAlert {
  message: string;
  severity: AlertSeverity;
  id?: string;
}

export const useSnackbar = () => {
  const [apiAlerts, setApiAlerts] = useState<ApiAlert[]>([]);

  const openSnackbar = useCallback(
    (apiAlert: ApiAlert) => {
      const id = uniqueId();
      setApiAlerts([...apiAlerts, { ...apiAlert, id }]);
    },
    [apiAlerts]
  );

  const removeAlert = useCallback(
    (apiAlertId: ApiAlert["id"]) => {
      if (apiAlertId) {
        setApiAlerts(apiAlerts.filter(({ id }) => apiAlertId !== id));
      }
    },
    [apiAlerts]
  );

  return { openSnackbar, snackbarParams: { apiAlert: apiAlerts[0], removeAlert } };
};

import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { uniqueId } from "lodash";
import React, { useCallback, useState } from "react";

interface SnackbarsProps {
  snackbarParams: {
    apiAlert: ApiAlert;
    removeAlert: (apiAlertId: ApiAlert["id"]) => void;
  };
}

export const Snackbars = ({ snackbarParams: { apiAlert, removeAlert } }: SnackbarsProps): JSX.Element | null => {
  const onCloseAlert = useCallback(
    (id: ApiAlert["id"]) => (_: React.SyntheticEvent | MouseEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      removeAlert(id);
    },
    [removeAlert]
  );

  return apiAlert ? (
    <Snackbar
      key={apiAlert.id}
      open={apiAlert !== null}
      autoHideDuration={6000}
      onClose={onCloseAlert(apiAlert?.id)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={onCloseAlert(apiAlert?.id)} severity={apiAlert?.severity}>
        {apiAlert?.message}
      </Alert>
    </Snackbar>
  ) : null;
};
