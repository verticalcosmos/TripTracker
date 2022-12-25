import inputForm from './Input';


// Load trips from memory
const retrieveTrips = () => {
  const trips = localStorage.getObjectItem('trips');
  return trips;
};

//Fetch image data
const getImage = async (trip) => {
  const response = await fetch('/api/image', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trip }),
  });
  const data = await response.json();
  try {
    return data;
  } catch (error) {
    return error;
  }
};

// Trips carousel
const createCarousel = (trip, i) => {
  const card = document.createElement('div');
  card.setAttribute('class', 'card');
  const preview = document.createElement('img');
  getImage(trip).then((result) => {
    if (result.hits[0]) {
      Object.assign(preview, {
        src: `${result.hits[0].previewURL}`,
        className: 'carouselCard',
        alt: `image of ${trip.city}`,
      });
    }
  });
  preview.setAttribute('dataPreview', `${i}`);
  card.appendChild(preview);
  return card;
};

// Toggle InputOverlay page for data input
const displayInputOverlay = () => {
  if (document.querySelector('.inputPage')) {
    document.body.removeChild(document.querySelector('.inputPage'));
  } else {
    const overlay = document.createElement('div');
    overlay.classList.add('inputPage');
    document.querySelector('body').appendChild(overlay);
  }
};


// Add trtip
const addTrip = () => {
  displayInputOverlay();
  const form = inputForm();
  document.querySelector('body').appendChild(form);
};



// Calculate date
const getDate = (trip) => {
  const months = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'Aug',
    '09': 'Sept',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };
  const date = `${trip.departure.day} ${months[trip.departure.month]} ${trip.departure.year}`;
  return date;
};

// calculate the number of days remaining to the start of a trip
const daysToDeparture = ({ departure }) => {
  const today = new Date().getTime();
  const departureDate = new Date(`${departure.month} ${departure.day}, ${departure.year}`).getTime();
  const interval = departureDate - today;
  const days = Math.floor(interval / (24 * 60 * 60 * 1000));
  return days;
};

// Get weather data
const gethWeather = async (trip, days) => {
  const response = await fetch('/api/weather', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trip, days }),
  });
  const data = await response.json();
  try {
    return data;
  } catch (error) {
    return error;
  }
};

//


// Create all trip elements 
const createTripElements = (trip) => {
  const daysCount = daysToDeparture(trip);
  const tripContainer = document.createElement('div');
  tripContainer.setAttribute('class', 'tripContainer');
  const tripInfoContainer = document.createElement('div');
  tripInfoContainer.setAttribute('class', 'tripInfoContainer');
  const countryText = document.createElement('h2');
  countryText.setAttribute('class', 'country');
  const cityText = document.createElement('h2');
  cityText.setAttribute('class', 'city');
  const departureDate = document.createElement('h3');
  departureDate.setAttribute('class', 'departure');
  const countDown = document.createElement('h3');
  countDown.setAttribute('class', 'timeToDeparture text');
  const weatherContainer = document.createElement('div');
  weatherContainer.setAttribute('class', 'weatherContainer');
  const temp = document.createElement('p');
  temp.setAttribute('class', 'temp');
  const weatherData = document.createElement('p');
  weatherData.setAttribute('class', 'weatherText');
  const infoContainer = document.createElement('div');
  infoContainer.setAttribute('class', 'info');
  const destination = document.createElement('h2');
  destination.setAttribute('class', 'destinationInfo');
  const date = document.createElement('h3');
  date.setAttribute('class', 'dateInfo');

  // Get and show a background image
  getImage(trip).then((result) => {
    if (result.hits[0]) {
      tripContainer.style.backgroundImage = `url(${result.hits[0].largeImageURL})`;
    }
  });

  // Get and show weather
  gethWeather(trip, daysCount).then((res) => {
    temp.innerText = `${res.data[0].temp} °C`;
    weatherData.innerText = `${res.data[0].weather.description}`;
    weatherContainer.appendChild(temp);
    weatherContainer.appendChild(weatherData);
  });

  //Show trip information 
  countryText.innerText = `${trip.country}`;
  cityText.innerText = `${trip.city}`;
  departureDate.innerText = `Departing on ${getDate(trip)}`;
  countDown.innerText = `${daysCount} days left to your trip`;
  destination.appendChild(cityText);
  destination.appendChild(countryText);
  date.appendChild(departureDate);
  date.appendChild(countDown);
  infoContainer.appendChild(destination);
  infoContainer.appendChild(date);
  const wrapper = document.createElement('div');
  wrapper.setAttribute('class', 'wrapper');
  wrapper.appendChild(tripInfoContainer);
  tripInfoContainer.appendChild(infoContainer);
  tripInfoContainer.appendChild(weatherContainer);
  tripContainer.appendChild(wrapper);

  // Create an Add New Trip button for adding more trip plans
  const newTrip = document.createElement('button');
  newTrip.innerText = '+ Add Another Trip';
  newTrip.classList.add('newTripBtn');
  newTrip.addEventListener('click', addTrip)
  tripInfoContainer.appendChild(newTrip);
  

  return tripContainer;
};



/* ----------- Display trips from memory ----------- */
// assign active state to the active trip
const showTrips = () => {
  const container = document.querySelector('.mainContainer');
  container.classList.add('active');
  container.innerHTML = ' ';

  // create cards for carousel
  const cardsContainer = document.createElement('div');
  cardsContainer.setAttribute('class', 'cards');

  // Load trips from memory
  const tripsArr = retrieveTrips();

  // Create trips info and a card for each added trip
  tripsArr.forEach((trip, i) => {
    const carouselSlides = createCarousel(trip, i);
    cardsContainer.appendChild(carouselSlides);
    const tripContainer = createTripElements(trip);
    container.appendChild(tripContainer);
  });

  // Show trips one by one
  let tripIndex = 0;
  let previews;
  const showTrip = (index) => {
    const trips = document.querySelectorAll('.tripContainer');
    if (index > trips.length - 1) tripIndex = 0;
    if (index < 0) tripIndex = trips.length - 1;
    setTimeout(() => {
      if (document.querySelectorAll('.cardPreveiw').length > 1) return;
      previews = document.querySelectorAll('.carouselCard');
      previews.forEach((preview) => {
        preview.classList.remove('active');
      });
      if (previews[tripIndex]) previews[tripIndex].classList.add('active');
    }, 1000);
    trips.forEach((trip) => {
      trip.style.display = 'none';
    });
    trips[tripIndex].style.display = 'block';
  };

  // Go back and forth between trips in memory
  showTrip(tripIndex);
  const nextTrip = (n) => {
    showTrip(tripIndex += n);
  };

  // Select trip over cards
  const activePreview = (n) => {
    showTrip(tripIndex = n);
  };

  // next and prev buttons for navigation between trips
  const nextTripButton = document.createElement('button');
  nextTripButton.setAttribute('class', 'nextTripBtn btn');
  nextTripButton.innerHTML = '&#10095;';
  const prevTripButton = document.createElement('button');
  prevTripButton.setAttribute('class', 'nextTripBtn btn');
  prevTripButton.innerHTML = '&#10094;';
  nextTripButton.addEventListener('click', () => {
    nextTrip(1);
  });
  prevTripButton.addEventListener('click', () => {
    nextTrip(-1);
  });

// Navigation between trips through cards
  cardsContainer.addEventListener('click', (e) => {
    if (e.target.nodeName === 'IMG') {
      activePreview(parseInt(e.target.dataset.previewindex));
    }
  });
  const tripsNavigation = document.createElement('div');
  tripsNavigation.setAttribute('class', 'tripsNav');
  tripsNavigation.appendChild(prevTripButton);
  tripsNavigation.appendChild(nextTripButton);
  container.appendChild(tripsNavigation);
  container.appendChild(cardsContainer);
};

export default showTrips;
