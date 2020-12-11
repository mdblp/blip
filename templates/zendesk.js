window.zESettings = {
  webWidget: {
    authenticate: {
      jwtFn: (/** @type{(token: string) => void} */ callback) => {
        // Item set in packages/platform-client/user.js
        const authToken = window.sessionStorage.getItem('zdkToken');
        if (typeof authToken === 'string' && authToken.length > 0) {
          console.info('Zendesk callback SSO token');
          callback(authToken);
        } else {
          console.warn('Zendesk callback SSO token: Missing token');
        }
      }
    }
  }
};
