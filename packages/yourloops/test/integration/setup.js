import '@testing-library/jest-dom/extend-expect'
//
/* This is done because the chat widget is using the scroll method, not implemented by jsdom which is manipulating only dom no layout */
Element.prototype.scroll = jest.fn()
