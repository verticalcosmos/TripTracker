import pinIcon from '../img/icon.png';

//managing date input
const dateHandler = (event) => {
  document.querySelector('.dateError').innerText = '';
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
  const allTrips = localStorage.getObjectItem('trips');
  allTrips.push(trip);
  localStorage.setObjectItem('trips', allTrips);
};

// Get location data
const getLocation = async (val) => {
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

// Content of trip class
class Trip {
  constructor(city, country, longitude, lattitude, createdAt) {
    this.city = city;
    this.country = country;
    this.longitude = longitude;
    this.lattitude = lattitude;
    this.createdAt = createdAt;
  }
};

// Autocomplete dropdown menu: activates when user types initials of the city
const generateResultsItems = (parent, value) => {
  if (!parent || !value) return;
  const fragment = new DocumentFragment();
  getLocation(value).then((data) => {
    Object.values(data)[1].forEach((obj) => {
      emptyList();
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
      resultItem.setAttribute('class', 'resultItem');
      const pinPoint = document.createElement('img');
      pinPoint.src = pinIcon;
      resultItem.appendChild(pinPoint);
      fragment.appendChild(resultItem);
    });
    parent.appendChild(fragment);
  });
};

// empty list of autocomplete suggestions
const emptyList = () => {
  const element = document.querySelector('.results');
  if (!element) return;
  element.childNodes.forEach((child) => {
    element.removeChild(child);
  });
};

// remove the autocomplete
const removeListOfSuggestions = () => {
  let element;
  if (document.querySelector('.results')) {
    element = document.querySelector('.results');
    element.remove();
  }
};

// Allow user to select from autocomplete suggestions
const resultItemSelected = (event) => {
  const { target } = event;
  if (target.classList.contains('resultItem')) {
    document.querySelector('#destinationInput').value = target.innerText;
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
    removeListOfSuggestions();
  }
};

// Autocomplete
const autocomplete = (inputElm) => {
  document.querySelector('.destinationError').innerText = '';
  let resultsContainer;
  const parent = inputElm.parentNode;
  const { value } = inputElm;
  const hasResultsContainer = !!document.querySelector('.results');
  if (!value && hasResultsContainer) {
    emptyList();
    removeListOfSuggestions();
    return;
  }
  if (hasResultsContainer) {
    resultsContainer = document.querySelector('.results');
  } else {
    resultsContainer = document.createElement('div');
    resultsContainer.setAttribute('class', 'results');
    parent.appendChild(resultsContainer);
    resultsContainer.addEventListener('click', resultItemSelected);
    document.addEventListener('click', () => {
      removeListOfSuggestions();
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
const countryInput = debounce((event) => {
  autocomplete(event.target);
}, 0);

// Display input page overlay
const displayInputOverlay = () => {
  if (document.querySelector('.inputPage')) {
    document.body.removeChild(document.querySelector('.inputPage'));
  } else {
    const overlay = document.createElement('div');
    overlay.classList.add('inputPage');
    document.querySelector('body').appendChild(overlay);
  }
};

//Save trip and handle input errors
const saveTrip = (e) => {
  e.preventDefault();
  if (!document.querySelector('#destinationInput').value) {
    document.querySelector('.destinationError').innerText = 'Please enter name of your destination';
  } else if (document.querySelector('#date').value.length < 1) {
    document.querySelector('.dateError').innerText = 'Please select date of yout travel';
  } else {
    window.location.reload();
  }
};

// Create the input form on overlay page
const inputForm = () => {
  const section = document.createElement('section');
  section.classList.add('formContainer', 'container');
  const form = document.createElement('form');
  form.setAttribute('action', '');
  form.setAttribute('autocomplete', 'off');
  form.classList.add('form');
  const inputContainer = document.createElement('div');
  inputContainer.classList.add('inputContainer');
  inputContainer.addEventListener('input', (e) => {
    countryInput(e);
  });

  // Destination input
  const countryInput = document.createElement('input');
    Object.assign(countryInput,
    {
      className: 'userInput',
      id: 'destinationInput',
      type: 'text',
      name: 'country',
      placeholder: 'Enter your destination',
    });

  // Handle destination error
  const countryError = document.createElement('p');
  countryError.setAttribute('class', 'destinationError error');

  // Date picker
  const dateContainer = document.createElement('div');
  const datePicker = document.createElement('input');
  datePicker.addEventListener('input', dateHandler);
  Object.assign(datePicker,
    {
      type: 'date',
      className: 'userInput',
      id: 'date',
    });

  // Handle date error
  const dateError = document.createElement('p');
  dateError.setAttribute('class', 'dateError error');
  dateContainer.appendChild(dateError);
  dateContainer.appendChild(datePicker);

  // Save button
  const button = document.createElement('button');
  button.setAttribute('class', 'submitBtn');
  button.classList.add('formSubmit');
  button.innerText = 'Save';
  button.addEventListener('click', saveTrip);

  inputContainer.appendChild(countryError);
  inputContainer.appendChild(countryInput);

  // Close button x
  const closeBtn = document.createElement('button');
  closeBtn.setAttribute('class', 'closeBtn');
  closeBtn.innerText = 'x';
  closeBtn.addEventListener('click', () => {
    displayInputOverlay();
    document.body.removeChild(document.querySelector('.formContainer'));
  });

  // From main text
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
