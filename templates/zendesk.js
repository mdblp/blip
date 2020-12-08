window.zESettings = {
  webWidget: {
    authenticate: {
      jwtFn: function (callback) {
        let authToken = window.localStorage.getItem('authToken');
        callback(authToken);
      }
    }
  }
};
