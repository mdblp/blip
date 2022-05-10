// eslint-disable-next-line no-undef
export const withAuthenticationRequired = jest.fn().mockImplementation((component) => {
  return component;
});

// eslint-disable-next-line no-undef
export const Auth0Provider = ({ children }) => children;

// eslint-disable-next-line no-undef
export const useAuth0 = jest.fn().mockReturnValue({
  isAuthenticated: true,
  isLoading: false,
  user: {
    user: {
      "email": "john.spartan@demolition.man",
      "email_verified": true,
      "sub": "auth0|0123456789",
      "http://your-loops.com/roles": ["hcp"],
    },
  }
});
