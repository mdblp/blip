/*
 * Copyright (c) 2022-2023, Diabeloop
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

import * as auth0Mock from '@auth0/auth0-react'
import userEvent from '@testing-library/user-event'
import { act, screen } from '@testing-library/react'
import { checkFooter } from '../../assert/footer'
import i18n from 'i18next'
import { renderPage } from '../../utils/render'
import { LanguageCodes } from '../../../../lib/auth/models/enums/language-codes.enum'

describe('Product labelling page', () => {
  beforeAll(() => {
    (auth0Mock.useAuth0 as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: undefined
    })
  })

  it('should render product labelling with the right selected language and version', async () => {
    renderPage('/')
    checkFooter({ needFooterLanguageSelector: false })

    await userEvent.click(screen.getByText('Product Labelling'))

    expect(screen.getByText(`YourLoops, version ${global.BUILD_CONFIG.VERSION as string}, released on 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-en-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_EN_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Intended Purpose and regulatory information')).toBeInTheDocument()
    expect(screen.getByText('Legal Manufacturer')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage(LanguageCodes.Fr)
    })
    expect(screen.getByText(`YourLoops, version ${global.BUILD_CONFIG.VERSION as string}, publiée le 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-fr-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_FR_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Usage prévu et informations réglementaires')).toBeInTheDocument()
    expect(screen.getByText('Fabricant')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage(LanguageCodes.It)
    })
    expect(screen.getByText(`YourLoops, versione ${global.BUILD_CONFIG.VERSION as string}, rilasciato il 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-it-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_IT_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Scopo previsto')).toBeInTheDocument()
    expect(screen.getByText('Fabricant')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage(LanguageCodes.Es)
    })
    expect(screen.getByText(`YourLoops, versión ${global.BUILD_CONFIG.VERSION as string}, publicada el 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-es-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_ES_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Finalidad prevista e información regulatoria')).toBeInTheDocument()
    expect(screen.getByText('Fabricante légal')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage(LanguageCodes.Nl)
    })
    expect(screen.getByText(`YourLoops, versie ${global.BUILD_CONFIG.VERSION as string}, uitgebracht op 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-nl-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_NL_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Beoogd doel')).toBeInTheDocument()
    expect(screen.getByText('Wettelijk fabrikant')).toBeInTheDocument()

    act(() => {
      i18n.changeLanguage(LanguageCodes.De)
    })
    expect(screen.getByText(`YourLoops, version ${global.BUILD_CONFIG.VERSION as string}, veröffentlicht am 2000-01-01`)).toBeInTheDocument()
    expect(screen.getByText(`YLPZ-RA-LAD-001-de-Rev${global.BUILD_CONFIG.YLPZ_RA_LAD_001_DE_REV as string}`)).toBeInTheDocument()
    expect(screen.getByText('Verwendungszweck')).toBeInTheDocument()
    expect(screen.getByText('Rechtmäßiger Hersteller')).toBeInTheDocument()
  })
})
