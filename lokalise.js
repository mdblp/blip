// Call external script to activate the Lokalise.com live preview plugin

window.LOKALISE_CONFIG = {
  projectId: 'the-project-id',
  locale: 'en',
  plainKey: true,
};

(function () {
  const a = document.createElement('script');
  a.type = 'text/javascript';
  a.async = !0;
  a.src = `https://lokalise.com/live-js/script.min.js?${(new Date).getTime()}`;
  document.body.appendChild(a);
})();
