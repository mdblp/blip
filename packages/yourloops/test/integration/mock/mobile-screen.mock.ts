import mediaQuery from 'css-mediaquery';

export const mockMobileScreen = () => {

  const widthScreen = 400

  function mockScreenWidth(width: number): void {
    globalThis.matchMedia = (query: string): MediaQueryList => ({
      matches: mediaQuery.match(query, { width }),
      media: query,
      onchange: null,
      addListener: () => {
      },
      removeListener: () => {
      },
      addEventListener: () => {
      },
      removeEventListener: () => {
      },
      dispatchEvent: () => true
    });
  }

  return mockScreenWidth(widthScreen)
}
