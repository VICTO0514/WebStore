/**
 * API_BASE defaults to backend port 8080 (see backend/src/main/resources/application.yml server.port).
 * Optional: set window.__API_BASE__ / window.__GA_ID__ in HTML before this file (see index.html).
 * Env templates and secrets: backend/.env.example (never commit backend/.env).
 */
(function () {
  const params = new URLSearchParams(window.location.search);
  const apiFromQuery = params.get('api');
  window.APP_CONFIG = {
    API_BASE:
      apiFromQuery ||
      window.__API_BASE__ ||
      localStorage.getItem('API_BASE') ||
      'http://localhost:8080',
    GA_ID: window.__GA_ID__ || '',
  };
})();
