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
