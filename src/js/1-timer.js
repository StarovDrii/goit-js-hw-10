import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startButton = document.querySelector('[data-start]');
startButton.setAttribute('disabled', true);
startButton.style.color = '#989898';
startButton.style.background = '#CFCFCF';

let userSelectedDate = '';
let intervalId;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > new Date()) {
      startButton.removeAttribute('disabled');
      startButton.removeAttribute('style');
      userSelectedDate = selectedDates[0];
    } else {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      startButton.setAttribute('disabled', true);
      startButton.style.color = '#989898';
      startButton.style.background = '#CFCFCF';
    }
  },
};

flatpickr('#datetime-picker', options);
startButton.addEventListener('click', startCountdown);

function startCountdown() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    const timeDifference = getTimeDifferenceObj();
    startButton.setAttribute('disabled', true);
    startButton.style.color = '#989898';
    startButton.style.background = '#CFCFCF';
    if (timeDifference <= 0) {
      iziToast.success({
        title: 'Done',
        message: 'The countdown is over',
        position: 'topRight',
      });
      clearInterval(intervalId);
      startButton.removeAttribute('disabled');
      startButton.removeAttribute('style');
    }
  }, 1000);
}

function getTimeDifferenceObj() {
  const timeDifference = userSelectedDate.getTime() - new Date().getTime();
  const timeDifferenceObj = convertMs(timeDifference);

  const { days, hours, minutes, seconds } = timeDifferenceObj;

  document.querySelector('[data-days]').innerText = addZero(days);
  document.querySelector('[data-hours]').innerText = addZero(hours);
  document.querySelector('[data-minutes]').innerText = addZero(minutes);
  document.querySelector('[data-seconds]').innerText = addZero(seconds);

  return timeDifference >= 1000 ? timeDifference - 1000 : 0;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addZero(value) {
  if (value > 100) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a more recent date',
      position: 'topRight',
    });
    clearInterval(intervalId);
    startButton.setAttribute('disabled', true);
    startButton.style.color = '#989898';
    startButton.style.background = '#CFCFCF';
    return 99;
  } else {
    startButton.removeAttribute('style');
    return value < 10 ? `0${value}` : value;
  }
}
