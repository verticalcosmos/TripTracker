import './styles/main.scss';
import './js/memory';
import app from './js/app';
import showTrips from './js/showTrips';

// Checks if there are any trips in the storage
if (!localStorage.getObjectItem('trips') || localStorage.getObjectItem('trips').length < 1) {
  // If no trips in storage, go to app page
  localStorage.setObjectItem('trips', []);
  app();
} else {
  showTrips();
}

if (module.hot) {
  module.hot.accept();
}
