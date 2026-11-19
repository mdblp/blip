import mediaQuery from 'css-mediaquery'

const DEFAULT_MOBILE_WIDTH_PX = 400

export const mockMobileScreen = () => {
  globalThis.matchMedia = (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width: DEFAULT_MOBILE_WIDTH_PX }),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
  })
}

// jsdom does not compute the layout: give the elements the screen width (e.g. the daily chart)
// Call jest.restoreAllMocks() after the test, as it mocks every HTMLElement
export const mockMobileElementWidth = () => {
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(DEFAULT_MOBILE_WIDTH_PX)
}
