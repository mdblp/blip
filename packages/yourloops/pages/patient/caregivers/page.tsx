/**
 * Copyright (c) 2021, Diabeloop
 * Patient care givers page
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

import React from "react";
import bows from "bows";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

import { UserInvitationStatus } from "../../../models/generic";
import { UserRoles } from "../../../models/shoreline";
import { useAuth } from "../../../lib/auth";
import metrics from "../../../lib/metrics";
import { setPageTitle } from "../../../lib/utils";
import { useNotification } from "../../../lib/notifications/hook";
import { ShareUser } from "../../../lib/share/models";
import { useAlert } from "../../../components/utils/snackbar";
import { AddDialogContentProps, RemoveDialogContentProps } from "./types";
import SecondaryBar from "./secondary-bar";
import AddCaregiverDialog from "./add-dialog";
import RemoveCaregiverDialog from "./remove-dialog";
import CaregiverTable from "./table";
import DirectShareApi from "../../../lib/share/direct-share-api";
import { NotificationType } from "../../../lib/notifications/models";

const log = bows("PatientCaregiversPage");

/**
 * Patient caregivers page
 */
function PatientCaregiversPage(): JSX.Element {
  const { t } = useTranslation("yourloops");
  const alert = useAlert();
  const authHook = useAuth();
  const notificationHook = useNotification();
  const [ caregiverToAdd, setCaregiverToAdd ] = React.useState<AddDialogContentProps | null>(null);
  const [ caregiverToRemove, setCaregiverToRemove ] = React.useState<RemoveDialogContentProps | null>(null);
  const [ caregivers, setCaregivers ] = React.useState<ShareUser[] | null>(null);
  const session = authHook.session();
  const { sentInvitations, initialized: haveNotifications } = notificationHook;

  const handleShowAddCaregiverDialog = async (): Promise<void> => {
    const getCaregiverEmail = (): Promise<string | null> => {
      return new Promise((resolve: (email: string | null) => void) => {
        setCaregiverToAdd({ onDialogResult: resolve });
      });
    };

    const email = await getCaregiverEmail();
    setCaregiverToAdd(null); // Close the dialog

    if (email !== null && session !== null) {
      try {
        await DirectShareApi.addDirectShare(session.user.userid, email);
        alert.success(t("alert-invitation-sent-success"));
        metrics.send("invitation", "send_invitation", "caregiver");
        // Refresh the notifications list
        notificationHook.update();
        // And refresh the list
        setCaregivers(null);
      } catch (reason) {
        log.error(reason);
        alert.error(t("alert-invitation-caregiver-failed"));
      }
    }
  };

  const handleRemoveCaregiver = async (us: ShareUser): Promise<void> => {
    const getConsent = (): Promise<boolean> => {
      return new Promise((resolve: (consent: boolean) => void) => {
        setCaregiverToRemove({ caregiver: us, onDialogResult: resolve });
      });
    };

    const consent = await getConsent();
    setCaregiverToRemove(null); // Close the dialog

    if (consent && session !== null) {
      try {
        if (us.status === UserInvitationStatus.pending && typeof us.invitation === "object") {
          await notificationHook.cancel(us.invitation);
        } else {
          await DirectShareApi.removeDirectShare(session.user.userid, us.user.userid);
        }
        alert.success(t("modal-patient-remove-caregiver-success"));
        setCaregivers(null); // Refresh the list
      } catch (reason) {
        log.error(reason);
        alert.error(t("modal-patient-remove-caregiver-failure"));
      }
    }
  };

  React.useEffect(() => {
    if (caregivers === null && session !== null && haveNotifications) {
      // Load caregivers
      const addPendingInvitation = (target: ShareUser[]) => {
        for (const invitation of sentInvitations) {
          if (invitation.type === NotificationType.directInvitation) {
            // Create a fake share user
            log.debug("Found pending direct-share invitation: ", invitation);
            const shareUser: ShareUser = {
              invitation,
              status: UserInvitationStatus.pending,
              user: {
                username: invitation.email,
                userid: uuidv4(),
                role: UserRoles.caregiver,
              },
            };
            target.push(shareUser);
          }
        }
      };

      DirectShareApi.getDirectShares().then((value) => {
        addPendingInvitation(value);
        setCaregivers(value);
      }).catch((reason: unknown) => {
        log.error(reason);
        const value: ShareUser[] = [];
        addPendingInvitation(value);
        setCaregivers(value);
      });
    }
  }, [caregivers, session, haveNotifications, sentInvitations]);

  React.useEffect(() => {
    setPageTitle(t("caregivers-title"));
  }, [t]);

  if (caregivers === null) {
    return (
      <CircularProgress
        id="patient-page-loading-progress"
        disableShrink
        style={{ position: "absolute", top: "calc(50vh - 20px)", left: "calc(50vw - 20px)" }}
      />
    );
  }

  return (
    <React.Fragment>
      <SecondaryBar onShowAddCaregiverDialog={handleShowAddCaregiverDialog} />
      <Container maxWidth="lg" style={{ marginTop: "4em", marginBottom: "2em" }}>
        <CaregiverTable userShares={caregivers} onRemoveCaregiver={handleRemoveCaregiver} />
      </Container>

      <AddCaregiverDialog actions={caregiverToAdd} />
      <RemoveCaregiverDialog actions={caregiverToRemove} />
    </React.Fragment>
  );
}

export default PatientCaregiversPage;
