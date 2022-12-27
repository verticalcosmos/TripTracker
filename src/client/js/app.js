import inputForm from './Input';

// Display trip input page on activation
const toggleOverlay = () => {
  if (document.querySelector('.overlay')) {
    document.body.removeChild(document.querySelector('.overlay'));
  } else {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.querySelector('body').appendChild(overlay);
  }
};

// Add trtip
const addTrip = () => {
  toggleOverlay();
  const form = inputForm();
  document.querySelector('body').appendChild(form);
};

// App function to run the addTrip function
const app = () => {
  const button = document.getElementById('mainBtn')
  button.addEventListener('click', addTrip);

};

export default app;
