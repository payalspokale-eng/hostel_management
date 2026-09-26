const bookingForm = document.querySelector("#bookingForm");
const checkinInput = document.querySelector("#checkin");
const checkoutInput = document.querySelector("#checkout");
const bookingFeedback = document.querySelector("#bookingFeedback");

function formatDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function setDateDefaults() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const checkinDate = today.toISOString().slice(0, 10);
  const checkoutDate = new Date(today);
  checkoutDate.setDate(checkoutDate.getDate() + 1);

  checkinInput.min = checkinDate;
  checkoutInput.min = checkoutDate.toISOString().slice(0, 10);
  checkinInput.value = checkinDate;
  checkoutInput.value = checkoutDate.toISOString().slice(0, 10);
}

checkinInput.addEventListener("change", () => {
  const nextDay = new Date(`${checkinInput.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const minimumCheckout = nextDay.toISOString().slice(0, 10);
  checkoutInput.min = minimumCheckout;

  if (checkoutInput.value <= checkinInput.value) {
    checkoutInput.value = minimumCheckout;
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const arrival = new Date(`${checkinInput.value}T12:00:00`);
  const departure = new Date(`${checkoutInput.value}T12:00:00`);
  const guestCount = Number(document.querySelector("#guests").value);
  const nights = Math.round((departure - arrival) / 86400000);
  bookingFeedback.textContent = `Great choice. Checking rooms for ${guestCount} ${guestCount === 1 ? "guest" : "guests"}, ${formatDate(arrival)} - ${formatDate(departure)} (${nights} ${nights === 1 ? "night" : "nights"}).`;
  document.querySelector("#rooms-title").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll(".choose-room").forEach((button) => {
  button.addEventListener("click", () => {
    bookingFeedback.textContent = `${button.dataset.room} selected. Choose your dates and guest count to check availability.`;
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "center" });
    checkinInput.focus({ preventScroll: true });
  });
});

setDateDefaults();