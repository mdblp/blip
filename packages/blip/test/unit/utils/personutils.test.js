

import { expect } from 'chai'

import personUtils from '../../../app/core/personutils'

describe('personutils', () => {

  describe('fullName', () => {
    it('should return full name if firstName/lastName exists', () => {
      const person = {
        profile: { firstName: 'Mary', lastName: 'Smith' }
      }

      const result = personUtils.fullName(person)

      expect(result).to.equal('Mary Smith')
    })
    it('should return full name if firstName/lastName is missing', () => {
      const person = {
        profile: {fullName: 'Mary Smith'}
      }

      const result = personUtils.fullName(person)

      expect(result).to.equal('Mary Smith')
    })
  })

  describe('firstName', () => {
    it('should return first name if exists', () => {
      const person = {
        profile: {fullName: 'Mary Smith', firstName: 'Mary'}
      }

      const result = personUtils.firstName(person)

      expect(result).to.equal(person.profile.firstName)
    })
    it("should return an empty string if it doesn't exist", () => {
      const person = {
        profile: {fullName: 'Mary Smith'}
      }

      const result = personUtils.firstName(person)

      expect(result).to.equal('')
    })
  })

  describe('lastName', () => {
    it('should return last name if exists', () => {
      const person = {
        profile: {fullName: 'Mary Smith', lastName: 'Smith'}
      }

      const result = personUtils.lastName(person)

      expect(result).to.equal(person.profile.lastName)
    })
    it("should return fullName if it doesn't exist", () => {
      const person = {
        profile: {fullName: 'Mary Smith'}
      }

      const result = personUtils.lastName(person)

      expect(result).to.equal(person.profile.fullName)
    })
  })
})
