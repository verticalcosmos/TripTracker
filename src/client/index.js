import './styles/main.scss';
import './js/memory';
import app from './js/app';
import showTrips from './js/showTrips';

// if there are trips in memory show trips if not add trip
if (!localStorage.getObjectItem('trips') || localStorage.getObjectItem('trips').length < 1) {
  localStorage.setObjectItem('trips', []);
  app();
  } else {
  showTrips();
  }

if (module.hot) {
  module.hot.accept();
}
