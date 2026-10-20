const form = document.getElementById('contact-form');
const inquiry = document.getElementById('inquiry');
const eventFields = document.getElementById('event-fields');
const eventFormat = document.getElementById('event_format');
const venueField = document.getElementById('venue-field');
const venueInput = document.getElementById('event_location');
function toggleVenueField() {
  const show = !eventFields.disabled && ['In person', 'Hybrid'].includes(eventFormat.value);
  venueField.hidden = !show;
  venueInput.disabled = !show;
}
eventFormat.addEventListener('change', toggleVenueField);
const status = document.getElementById('form-status');
const button = form.querySelector('button[type="submit"]');
function toggleEventFields() {
  const show = ['Speaking', 'Workshops'].includes(inquiry.value);
  eventFields.hidden = !show;
  eventFields.disabled = !show;
  toggleVenueField();
}
inquiry.addEventListener('change', toggleEventFields);
toggleEventFields();
function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
  status.focus();
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (button.disabled) return;
  const data = new FormData(form);

  button.disabled = true;
  button.textContent = 'Sending…';
  status.textContent = '';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(data)),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error('Submission failed');
    form.reset();
    toggleEventFields();
    showStatus('Thank you for reaching out! Your message has been sent. I’ll respond soon.', 'success');
  } catch (error) {
    showStatus(error.name === 'AbortError' ? 'The request timed out, so delivery could not be confirmed. Your message is still here; please try again shortly.' : 'Your message could not be sent. Your details are still here—please try again shortly.', 'error');
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
    button.textContent = 'Send message 🍵';
  }
});
