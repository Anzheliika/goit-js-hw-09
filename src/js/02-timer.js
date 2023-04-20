import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  input: document.getElementById('datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  dataDays: document.querySelector('span[data-days]'),
  dataHours: document.querySelector('span[data-hours]'),
  dataMinutes: document.querySelector('span[data-minutes]'),
  dataSeconds: document.querySelector('span[data-seconds]'),
};

let intervalId = null;
let selectedDate = null;

refs.startBtn.disabled = true;
refs.startBtn.addEventListener('click', onStartTimer);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] - Date.now() <= 0) {
        Notify.failure('Please choose a date in the future', {
            width: "350px",
            fontSize: '18px',
      });
    } else {
      selectedDate = selectedDates[0];
      refs.startBtn.disabled = false;
    }
  },
};

flatpickr(refs.input, options);

function onStartTimer() {
  refs.startBtn.disabled = true;
  intervalId = setInterval(() => {
    const time = selectedDate - Date.now();
    const { days, hours, minutes, seconds } = convertMs(time);
    updateClockFace({ days, hours, minutes, seconds });
    if (time <= 1000) {
      onStopTimer();
    }
  }, 1000);
}

function onStopTimer() {
  clearInterval(intervalId);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.dataDays.textContent = addLeadingZero(days);
  refs.dataHours.textContent = addLeadingZero(hours);
  refs.dataMinutes.textContent = addLeadingZero(minutes);
  refs.dataSeconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
