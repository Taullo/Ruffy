  document.addEventListener('DOMContentLoaded', function() {
    const localSettingsJSON = localStorage.getItem('mastodon-settings');
    var theme = (localSettingsJSON !== null) ? (JSON.parse(localSettingsJSON).theme ?? 'auto') : 'auto';
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    if (((prefersLight === true) && (theme === 'auto')) || (theme === 'light')) {
      document.body.classList.toggle('light-theme', true);
    }
    else if (((prefersLight === false) && (theme === 'auto')) || (theme === 'dark')) {
      document.body.classList.toggle('dark-theme', true);
    }
    else {
      document.body.classList.toggle('mixed-theme', true);
    }
  });
