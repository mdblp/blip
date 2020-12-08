window.zESettings = {
  webWidget: {
    authenticate: {
      jwtFn: function (callback) {
        let authToken = window.sessionStorage.getItem('zdkToken');
        callback(authToken);
      }
    }
  }
};
