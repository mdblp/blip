// eslint-disable-next-line no-undef
export const withAuthenticationRequired = jest.fn().mockImplementation((component, _) => {
  return component;
});

// eslint-disable-next-line no-undef
export const Auth0Provider = ({ children }: { children: JSX.Element }) => children;

// eslint-disable-next-line no-undef
export const useAuth0 = jest.fn().mockReturnValue({
  isAuthenticated: true,
  isLoading: false,
});
