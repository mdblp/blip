/**
 * Copyright (c) 2021-2022, Diabeloop
 * Profile page tests
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
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate, SyntheticEventData } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";

import { Units } from "../../../models/generic";
import { loggedInUsers } from "../../common";
import ProfilePage from "../../../pages/profile";
import { Profile, UserRoles } from "../../../models/shoreline";
import * as authHookMock from "../../../lib/auth";
import User from "../../../lib/auth/user";
import { HcpProfession } from "../../../models/hcp-profession";
import { genderLabels } from "../../../lib/auth/helpers";

jest.mock("../../../lib/auth");

describe("Profile", () => {
  let container: HTMLElement | null = null;
  const setUserMock= jest.fn();
  const userId = "fakeUserId";

  const patientUser = new User({
    userid: "a0a0a0b0",
    username: "josephine.dupuis@example.com",
    role: UserRoles.patient,
    preferences: { displayLanguageCode: "fr" },
    profile: {
      firstName: "Josephine",
      lastName: "Dupuis",
      fullName: "Josephine D.",
      patient: {
        birthday: "1964-12-01",
        birthPlace: "Anywhere",
        diagnosisDate: "2020-12-02",
        diagnosisType: "1",
        referringDoctor: "Dr Dre",
        sex: "M",
        ins: "123456789012345",
        ssn: "012345678901234",
      },
    },
    settings: { a1c: { date: "2020-01-01", value: "7.5" } },
  });

  async function mountProfilePage(): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <BrowserRouter>
            <ProfilePage />
          </BrowserRouter>, container, resolve);
      });
    });
  }

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  beforeAll(() => {
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
        } as User,
      };
    });
  });

  it("should be able to render", async () => {
    await mountProfilePage();
    expect(container.querySelector("#profile-textfield-firstname").id).toBe("profile-textfield-firstname");
    expect(container.querySelector("#profile-button-save").id).toBe("profile-button-save");
  });

  it("should display mg/dL Units by default if not specified", async () => {
    const user = loggedInUsers.hcpUser;
    delete user.settings?.units?.bg;
    await mountProfilePage();
    const selectValue = container.querySelector("#profile-units-selector").innerHTML;
    expect(selectValue).toBe(Units.gram);
  });

  it("should display birthdate if user is a patient", async () => {
    const birthday = "1964-12-01";
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.patient,
          isUserPatient: () => true,
          isUserHcp: () => false,
          profile: { patient: { birthday } } as Profile,
        } as User,
      };
    });
    await mountProfilePage();
    const birthDateInput = container.querySelector("#profile-textfield-birthdate") as HTMLInputElement;
    expect(birthDateInput?.value).toBe(birthday);
  });

  it("should display birthplace if user is a patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: patientUser,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const birthPlaceInput = container.querySelector("#profile-textfield-birthplace") as HTMLInputElement;
    expect(birthPlaceInput?.value).toBe(patientUser.profile?.patient?.birthPlace);
  });

  it("should display gender if user is a patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: patientUser,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const genderValue = container.querySelector("#profile-select-gender").innerHTML;
    expect(genderValue).toBe(genderLabels()[patientUser.profile?.patient?.sex]);
  });

  it("should display referring doctor if user is a patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: patientUser,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const referringDoctorInput = container.querySelector("#profile-textfield-referring-doctor") as HTMLInputElement;
    expect(referringDoctorInput?.value).toBe(patientUser.profile?.patient?.referringDoctor);
  });

  it("should not display INS if user is not a french patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: patientUser,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const insInput = container.querySelector("#profile-textfield-ins") as HTMLInputElement;
    expect(insInput).toBeNull();
  });

  it("should display INS if user is a french patient", async () => {
    const user = new User({
      userid: "a0a0a0b0",
      username: "josephine.dupuis@example.com",
      role: UserRoles.patient,
      preferences: { displayLanguageCode: "fr" },
      profile: {
        firstName: "Josephine",
        lastName: "Dupuis",
        fullName: "Josephine D.",
        patient: {
          birthday: "1964-12-01",
          birthPlace: "Anywhere",
          diagnosisDate: "2020-12-02",
          diagnosisType: "1",
          referringDoctor: "Dr Dre",
          sex: "M",
          ins: "123456789012345",
          ssn: "012345678901234",
        },
      },
      settings: { a1c: { date: "2020-01-01", value: "7.5" }, country : "FR" },
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const insInput = container.querySelector("#profile-textfield-ins") as HTMLInputElement;
    expect(insInput?.value).toBe(user.profile?.patient?.ins);
  });

  it("should not display SSN if user is not a french patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: patientUser,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const ssnInput = container.querySelector("#profile-textfield-ssn") as HTMLInputElement;
    expect(ssnInput).toBeNull();
  });

  it("should display SSN if user is a french patient", async () => {
    const user = new User({
      userid: "a0a0a0b0",
      username: "josephine.dupuis@example.com",
      role: UserRoles.patient,
      preferences: { displayLanguageCode: "fr" },
      profile: {
        firstName: "Josephine",
        lastName: "Dupuis",
        fullName: "Josephine D.",
        patient: {
          birthday: "1964-12-01",
          birthPlace: "Anywhere",
          diagnosisDate: "2020-12-02",
          diagnosisType: "1",
          referringDoctor: "Dr Dre",
          sex: "M",
          ins: "123456789012345",
          ssn: "012345678901234",
        },
      },
      settings: { a1c: { date: "2020-01-01", value: "7.5" }, country : "FR" },
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const ssnInput = container.querySelector("#profile-textfield-ssn") as HTMLInputElement;
    expect(ssnInput?.value).toBe(user.profile?.patient?.ssn);
  });

  it("should not display profession if user is a patient", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.patient,
          isUserPatient: () => true,
          isUserHcp: () => false,
        } as User,
      };
    });
    await mountProfilePage();
    const hcpProfessionSelectInput = container.querySelector("#profile-hcp-profession-selector + input");
    expect(hcpProfessionSelectInput).toBeNull();
  });

  it("should not display pro sante connect button if user is not a french hcp", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: "EN" },
        } as User,
      };
    });
    await mountProfilePage();
    const proSanteConnectButton = container.querySelector("#pro-sante-connect-button");
    expect(proSanteConnectButton).toBeNull();
  });

  it("should display pro sante connect button if user is a french hcp and his account is not certified", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: "FR" },
          frProId: undefined,
        } as User,
      };
    });
    await mountProfilePage();
    const proSanteConnectButton = container.querySelector("#pro-sante-connect-button");
    expect(proSanteConnectButton).not.toBeNull();
  });

  it("should display eCPS number if user is a french hcp and his account is certified", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: "FR" },
          emailVerified: true,
          frProId: "ANS20211229094028",
          getParsedFrProId: () => "",
          userid: userId,
        } as User,
      };
    });
    await mountProfilePage();
    const textField = container.querySelector("#professional-account-number-text-field");
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${userId}`);
    expect(certifiedIcon).not.toBeNull();
    expect(textField).not.toBeNull();
  });

  it("should not display certified icon if user is a french hcp and his account is not certified", async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserPatient: () => false,
          isUserHcp: () => true,
          settings: { country: "FR" },
          emailVerified: false,
          frProId: undefined,
          getParsedFrProId: () => "",
          userid: userId,
        } as User,
      };
    });
    await mountProfilePage();
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${userId}`);
    expect(certifiedIcon).toBeNull();
  });

  it("should update settings when saving after changing units", async () => {
    const updateSettings = jest.fn();
    const user = new User({
      userid: "a0000000",
      username: "john.doe@example.com",
      role: UserRoles.hcp,
      emailVerified: true,
      frProId: "ANS20211229094028",
      profile: { firstName: "John", lastName: "Doe", fullName: "John Doe", hcpProfession: HcpProfession.diabeto },
      preferences: { displayLanguageCode: "en" },
      settings: { units: { bg: Units.gram }, country: "FR" },
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user,
        updateSettings,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();
    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const unitSelectInput = container?.querySelector("#profile-units-selector + input");

    expect(saveButton.disabled).toBeTruthy();
    Simulate.change(unitSelectInput, { target: { value: Units.mole } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBeFalsy();
    Simulate.click(saveButton);
    expect(updateSettings).toHaveBeenCalledTimes(1);
  });

  it("should update preferences when saving after changing language", async () => {
    const updatePreferences = jest.fn();
    const user = new User({
      userid: "a0000000",
      username: "john.doe@example.com",
      role: UserRoles.hcp,
      emailVerified: true,
      frProId: "ANS20211229094028",
      profile: { firstName: "John", lastName: "Doe", fullName: "John Doe", hcpProfession: HcpProfession.diabeto },
      preferences: { displayLanguageCode: "en" },
      settings: { units: { bg: Units.gram }, country: "FR" },
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user,
        updatePreferences,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();

    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const languageSelectInput = container.querySelector("#profile-locale-selector + input");

    expect(saveButton.disabled).toBeTruthy();
    Simulate.change(languageSelectInput, { target: { value: "es" } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBeFalsy();
    Simulate.click(saveButton);
    expect(updatePreferences).toHaveBeenCalledTimes(1);
  });

  it("should update profile when saving after changing firstname", async () => {
    const updateProfile = jest.fn();
    const user = new User({
      userid: "a0000000",
      username: "john.doe@example.com",
      role: UserRoles.hcp,
      emailVerified: true,
      frProId: "ANS20211229094028",
      profile: { firstName: "John", lastName: "Doe", fullName: "John Doe", hcpProfession: HcpProfession.diabeto },
      preferences: { displayLanguageCode: "en" },
      settings: { units: { bg: Units.gram }, country: "FR" },
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user,
        updateProfile,
        setUser: setUserMock,
      };
    });
    await mountProfilePage();

    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const firstnameInput: HTMLInputElement = container.querySelector("#profile-textfield-firstname");

    expect(saveButton.disabled).toBe(true);
    Simulate.change(firstnameInput, { target: { value: "Chandler" } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBe(false);
    Simulate.click(saveButton);
    expect(updateProfile).toHaveBeenCalledTimes(1);
  });
});

