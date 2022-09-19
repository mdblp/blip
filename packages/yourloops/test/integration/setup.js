import '@testing-library/jest-dom/extend-expect'
//
/* This is done because the chat widget is using the scroll method, not implemented by jsdom which is manipulating only dom no layout */
Element.prototype.scroll = jest.fn()

// eslint-disable-next-line no-import-assign
// browserLocale.default = jest.fn(() => 'fr')
// jest.spyOn(browserLocale, 'browserLocale').mockReturnValue('fr')
jest.mock('../../lib/browser-locale', () => ({
  // __esModule: true, // this property makes it work
  default: jest.fn(() => 'fr')
}))
