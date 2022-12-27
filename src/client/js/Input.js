import pinIcon from '../img/icon.png';

//managing date input
const dateInputHandler = (event) => {
  document.querySelector('.date-input-error').innerText = '';
  const date = event.target.value.split('-');
  const updatedTrips = localStorage.getObjectItem('trips');
  const departure = {
    month: date[1],
    day: date[2],
    year: date[0],
  };
  updatedTrips[updatedTrips.length - 1].departure = departure;
  localStorage.setObjectItem('trips', updatedTrips);
};


// Add trip to memory
const addTripToMemory = (trip) => {
  const arrayOfTrips = localStorage.getObjectItem('trips');
  arrayOfTrips.push(trip);
  localStorage.setObjectItem('trips', arrayOfTrips);
};


// Get location data
const fetchLocation = async (val) => {
  const response = await fetch('/api/coordination', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ val }),
  });
  const data = await response.json();
  try {
    return data;
  } catch (error) {
    return error;
  }
};

// Content of trip
class Trip {
  constructor(city, country, longitude, lattitude, createdAt) {
    this.city = city;
    this.country = country;
    this.longitude = longitude;
    this.lattitude = lattitude;
    this.createdAt = createdAt;
  }

// manage storage
  remove() {
    const arrayOfTrips = localStorage.getObjectItem('trips');
    arrayOfTrips.forEach((trip, i) => {
      if (trip.city === this.city) {
        return arrayOfTrips.splice(i, 1);
      }
    });
    localStorage.setObjectItem('trips', arrayOfTrips);
  }
};

// Autocomplete dropdown menu: activates when user types initials of the city
const generateResultsItems = (parent, value) => {
  if (!parent || !value) return;
  const fragment = new DocumentFragment();
  fetchLocation(value).then((data) => {
    Object.values(data)[1].forEach((obj) => {
      emptyListContainer();
      const resultItem = document.createElement('div');
      if (obj.name.substr(0, value.length).toLowerCase() === value.toLowerCase()) {
         resultItem.innerHTML = `<strong>${obj.name.substr(0, value.length)}</strong>${obj.name.substr(value.length)}, ${obj.countryName}`;
      } else {
        resultItem.innerHTML = `${obj.name.substr(0, value.length)}${obj.name.substr(value.length)}, ${obj.countryName}`;
      }
      resultItem.setAttribute('data-longitude', `${obj.lng}`);
      resultItem.setAttribute('data-lattitude', `${obj.lat}`);
      resultItem.setAttribute('data-city', `${obj.name}`);
      resultItem.setAttribute('data-country', `${obj.countryName}`);
      resultItem.setAttribute('role', 'option');
      resultItem.setAttribute('class', 'result-item');
      const pin = document.createElement('img');
      pin.src = pinIcon;
      resultItem.appendChild(pin);
      fragment.appendChild(resultItem);
    });
    parent.appendChild(fragment);
  });
};

// empty list of autocomplete suggestions
const emptyListContainer = () => {
  const element = document.querySelector('.results');
  if (!element) return;
  element.childNodes.forEach((child) => {
    element.removeChild(child);
  });
};

// remove the autocomplete
const removeListContainer = () => {
  let element;
  if (document.querySelector('.results')) {
    element = document.querySelector('.results');
    element.remove();
  }
};

// Allow user to select from autocomplete suggestions
const resultItemOnClick = (event) => {
  const { target } = event;
  if (target.classList.contains('result-item')) {
    document.querySelector('#country-input').value = target.innerText;
    const element = target;
    const currentClick = new Date();
    const createdAt = currentClick.toGMTString();
    const newTrip = new Trip(
      element.dataset.city,
      element.dataset.country,
      element.dataset.longitude,
      element.dataset.lattitude,
      createdAt,
    );

 // Save info to memory
    addTripToMemory(newTrip);
    removeListContainer();
  }
};

// Autocomplete
// inspired by: https://www.w3schools.com/howto/howto_js_autocomplete.asp
const autocomplete = (inputElm) => {
  document.querySelector('.country-input-error').innerText = '';
  let resultsContainer;
  const parent = inputElm.parentNode;
  const { value } = inputElm;
  const hasResultsContainer = !!document.querySelector('.results');
  if (!value && hasResultsContainer) {
    emptyListContainer();
    removeListContainer();
    return;
  }
  if (hasResultsContainer) {
    resultsContainer = document.querySelector('.results');
  } else {
    resultsContainer = document.createElement('div');
    resultsContainer.setAttribute('class', 'results');
    parent.appendChild(resultsContainer);
    resultsContainer.addEventListener('click', resultItemOnClick);
    document.addEventListener('click', () => {
      removeListContainer();
    });
  }
  generateResultsItems(resultsContainer, value);
};
const debounce = (func, timeout) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
};
const countryInputHandler = debounce((event) => {
  autocomplete(event.target);
}, 0);

// Display input page overlay
const toggleOverlay = () => {
  if (document.querySelector('.overlay')) {
    document.body.removeChild(document.querySelector('.overlay'));
  } else {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.querySelector('body').appendChild(overlay);
  }
};

//Save trip and handle input errors
const saveTrip = (e) => {
  e.preventDefault();
  if (!document.querySelector('#country-input').value) {
    document.querySelector('.country-input-error').innerText = 'Please enter destination';
  } else if (document.querySelector('#date').value.length < 1) {
    document.querySelector('.date-input-error').innerText = 'Please select date of departure';
  } else {
    window.location.reload();
  }
};


// Create the input form on overlay page
const inputForm = () => {
  const section = document.createElement('section');
  section.classList.add('form-wrapper', 'container');
  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('autocomplete', 'off');
  form.classList.add('form');
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('input-container');
  inputContainer.addEventListener('input', (e) => {
    countryInputHandler(e);
  });

  // Destination input
  const countryInput = document.createElement('input');
  Object.assign(countryInput,
    {
      className: 'user-input',
      id: 'country-input',
      type: 'text',
      name: 'country',
      placeholder: 'Enter destination',
    });

  // Handle destination error
  const countryError = document.createElement('p');
  countryError.setAttribute('class', 'country-input-error error');

 // Date picker
  const dateContainer = document.createElement('div');
  const datePicker = document.createElement('input');
  datePicker.addEventListener('input', dateInputHandler);
  Object.assign(datePicker,
    {
      type: 'date',
      className: 'user-input',
      id: 'date',
    });

  // Handle date error
  const dateError = document.createElement('p');
  dateError.setAttribute('class', 'date-input-error error');
  dateContainer.appendChild(dateError);
  dateContainer.appendChild(datePicker);

   // Save button
  const button = document.createElement('button');
  button.setAttribute('class', 'submit-btn');
  button.classList.add('form__submit');
  button.innerText = 'Save';
  button.addEventListener('click', saveTrip);

  inputContainer.appendChild(countryError);
  inputContainer.appendChild(countryInput);

  // Close button x
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('class', 'close-btn');
  closeBtn.innerText = 'x';
  closeBtn.addEventListener('click', () => {
    toggleOverlay();
    document.body.removeChild(document.querySelector('.form-wrapper'));
  });

// Form's main text
  const formHeader = document.createElement('h2');
  formHeader.innerText = 'Choose your destination and date of departure';
  form.appendChild(formHeader);
  form.appendChild(inputContainer);
  form.appendChild(dateContainer);
  form.appendChild(button);
  form.appendChild(closeBtn);
  section.appendChild(form);

  return section;
};

export default inputForm;
