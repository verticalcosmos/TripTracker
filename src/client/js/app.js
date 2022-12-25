import inputForm from './Input';



// Display trip input page on activation
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


// App function to run the addTrip function
const app = () => {
  const button = document.getElementById('mainBtn')
  button.addEventListener('click', addTrip);

};

export default app;
