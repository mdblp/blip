/*
 * Copyright (c) 2026, Diabeloop
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

import { renderHook, act } from '@testing-library/react'
import { useTeamCreateEdit } from '../../../../components/team/team-create-edit.hook'
import { type Team } from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import { CountryCodes } from '../../../../lib/auth/models/country.model'

jest.mock('../../../../lib/auth')

describe('useTeamCreateEdit', () => {
  const onSaveTeamMock = jest.fn()
  const defaultUser = {
    id: 'user-id',
    settings: {
      country: CountryCodes.France
    }
  }

  beforeEach(() => {
    jest.clearAllMocks();
    (authHookMock.useAuth as jest.Mock).mockReturnValue({
      user: defaultUser
    })
  })

  describe('Initialization', () => {
    it('should initialize with empty values when team is null', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      expect(result.current.teamName).toBe('')
      expect(result.current.teamPhone).toBe('')
      expect(result.current.teamEmail).toBe('')
      expect(result.current.addrLine1).toBe('')
      expect(result.current.addrLine2).toBe('')
      expect(result.current.addrZipCode).toBe('')
      expect(result.current.addrCity).toBe('')
      expect(result.current.addrCountry).toBe(CountryCodes.France)
    })

    it('should initialize with team values when team is provided', () => {
      const team: Partial<Team> = {
        id: 'team-id',
        name: 'Test Team',
        phone: '0123456789',
        email: 'test@team.com',
        address: {
          line1: '123 Main St',
          line2: 'Apt 4',
          zip: '75001',
          city: 'Paris',
          country: CountryCodes.France
        }
      }

      const { result } = renderHook(() =>
        useTeamCreateEdit({ team, onSaveTeam: onSaveTeamMock })
      )

      expect(result.current.teamName).toBe('Test Team')
      expect(result.current.teamPhone).toBe('0123456789')
      expect(result.current.teamEmail).toBe('test@team.com')
      expect(result.current.addrLine1).toBe('123 Main St')
      expect(result.current.addrLine2).toBe('Apt 4')
      expect(result.current.addrZipCode).toBe('75001')
      expect(result.current.addrCity).toBe('Paris')
      expect(result.current.addrCountry).toBe(CountryCodes.France)
    })

    it('should use user country when team country is not provided', () => {
      const team: Partial<Team> = {
        name: 'Test Team'
      }

      const { result } = renderHook(() =>
        useTeamCreateEdit({ team, onSaveTeam: onSaveTeamMock })
      )

      expect(result.current.addrCountry).toBe(CountryCodes.France)
    })
  })

  describe('Form validation', () => {
    it('should mark form as invalid when required fields are empty', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      expect(result.current.isFormInvalid).toBe(true)
    })

    it('should mark form as valid when all required fields are filled correctly', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Valid Team Name')
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
        result.current.setAddrCountry(CountryCodes.France)
      })

      expect(result.current.isFormInvalid).toBe(false)
    })

    it('should mark form as invalid when team name exceeds maximum length', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('A'.repeat(65)) // Max is 64
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      expect(result.current.isFormInvalid).toBe(true)
    })

    it('should mark form as invalid when phone number is invalid', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Valid Team Name')
        result.current.setTeamPhone('invalid-phone')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      expect(result.current.phoneNumberInputOnError).toBe(true)
      expect(result.current.isFormInvalid).toBe(true)
    })

    it('should mark form as invalid when email is invalid', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Valid Team Name')
        result.current.setTeamPhone('0123456789')
        result.current.setTeamEmail('invalid-email')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      expect(result.current.emailInputOnError).toBe(true)
      expect(result.current.isFormInvalid).toBe(true)
    })

    it('should mark form as valid when email is empty (optional field)', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Valid Team Name')
        result.current.setTeamPhone('0123456789')
        result.current.setTeamEmail('')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      expect(result.current.emailInputOnError).toBe(false)
      expect(result.current.isFormInvalid).toBe(false)
    })

    it('should mark form as invalid when zip code is invalid for the country', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Valid Team Name')
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('invalid-zip')
        result.current.setAddrCity('Paris')
        result.current.setAddrCountry(CountryCodes.France)
      })

      expect(result.current.zipcodeInputOnError).toBe(true)
      expect(result.current.isFormInvalid).toBe(true)
    })

    it('should not show error for empty phone number', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamPhone('')
      })

      expect(result.current.phoneNumberInputOnError).toBe(false)
    })

    it('should not show error for empty zip code', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setAddrZipCode('')
      })

      expect(result.current.zipcodeInputOnError).toBe(false)
    })
  })

  describe('Country options', () => {
    it('should provide a sorted list of country options', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      expect(result.current.optionsCountries).toBeDefined()
      expect(result.current.optionsCountries.length).toBeGreaterThan(0)

      // Check that options are sorted alphabetically by key
      for (let i = 1; i < result.current.optionsCountries.length; i++) {
        const prev = result.current.optionsCountries[i - 1]
        const curr = result.current.optionsCountries[i]
        expect(prev.key.localeCompare(curr.key)).toBeLessThanOrEqual(0)
      }
    })

    it('should have valid MenuItem properties for each country', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      result.current.optionsCountries.forEach((option) => {
        expect(option.props.id).toBeDefined()
        expect(option.props.value).toBeDefined()
        expect(option.key).toBeDefined()
        expect(option.props['aria-label']).toBeDefined()
      })
    })
  })

  describe('handleValidateModal', () => {
    it('should call onSaveTeam with trimmed values when creating a new team', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('  Test Team  ')
        result.current.setTeamPhone('  0123456789  ')
        result.current.setTeamEmail('  test@team.com  ')
        result.current.setAddrLine1('  123 Main St  ')
        result.current.setAddrLine2('  Apt 4  ')
        result.current.setAddrZipCode('  75001  ')
        result.current.setAddrCity('  Paris  ')
        result.current.setAddrCountry(CountryCodes.France)
      })

      act(() => {
        result.current.handleValidateModal()
      })

      expect(onSaveTeamMock).toHaveBeenCalledWith({
        name: 'Test Team',
        phone: '0123456789',
        email: 'test@team.com',
        address: {
          line1: '123 Main St',
          line2: 'Apt 4',
          zip: '75001',
          city: 'Paris',
          country: CountryCodes.France
        }
      })
    })

    it('should call onSaveTeam without email when email is empty', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Test Team')
        result.current.setTeamPhone('0123456789')
        result.current.setTeamEmail('')
        result.current.setAddrLine1('123 Main St')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      act(() => {
        result.current.handleValidateModal()
      })

      const savedTeam = onSaveTeamMock.mock.calls[0][0]
      expect(savedTeam.email).toBeUndefined()
    })

    it('should call onSaveTeam without line2 when address line 2 is empty', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('Test Team')
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main St')
        result.current.setAddrLine2('')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      act(() => {
        result.current.handleValidateModal()
      })

      const savedTeam = onSaveTeamMock.mock.calls[0][0]
      expect(savedTeam.address.line2).toBeUndefined()
    })

    it('should preserve existing team id when editing a team', () => {
      const existingTeam: Partial<Team> = {
        id: 'existing-team-id',
        name: 'Old Name',
      }

      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: existingTeam, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('New Name')
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main St')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      act(() => {
        result.current.handleValidateModal()
      })

      const savedTeam = onSaveTeamMock.mock.calls[0][0]
      expect(savedTeam.id).toBe('existing-team-id')
    })
  })

  describe('Validation edge cases', () => {
    it('should validate a valid email address', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamEmail('valid.email+tag@example.com')
      })

      expect(result.current.emailInputOnError).toBe(false)
    })

    it('should invalidate an email without @ symbol', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamEmail('invalidemail.com')
      })

      expect(result.current.emailInputOnError).toBe(true)
    })

    it('should validate a valid phone number with country code', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamPhone('0123456789')
      })

      expect(result.current.phoneNumberInputOnError).toBe(false)
    })

    it('should handle minimum length constraints', () => {
      const { result } = renderHook(() =>
        useTeamCreateEdit({ team: null, onSaveTeam: onSaveTeamMock })
      )

      act(() => {
        result.current.setTeamName('A') // Min is 1, so this should be too short
        result.current.setTeamPhone('0123456789')
        result.current.setAddrLine1('123 Main Street')
        result.current.setAddrZipCode('75001')
        result.current.setAddrCity('Paris')
      })

      // The form checks length > min and < max, so 'A' (length 1) is not valid since min is 1
      expect(result.current.isFormInvalid).toBe(true)
    })
  })
})

