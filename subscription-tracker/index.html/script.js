// Global Variables
let subscriptions = JSON.parse(localStorage.getItem('subscriptions')) || [];
let editingIndex = null;

const list = document.getElementById('subscription-list');
const notificationContainer = document.getElementById('notification-container');
const addSubscriptionForm = document.getElementById('addSubscriptionForm');

// Show Notifications
function showNotification(message) {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.innerHTML = `${message} <button onclick="this.parentElement.remove()">×</button>`;
  notificationContainer.appendChild(notification);
}

// Render Subscriptions
function renderSubscriptions() {
  list.innerHTML = '';
  const today = new Date().toISOString().split('T')[0];

  subscriptions.forEach((sub, index) => {
    const li = document.createElement('li');
    const isTrialEnding = sub.endDate && new Date(sub.endDate) <= new Date(today);
    const alertText = isTrialEnding ? '<span class="alert">Trial Ending Soon!</span>' : '';

    li.innerHTML = `
      <div class="subscription-info">
        <p>${sub.name} - $${sub.cost} - Starts: ${sub.startDate} - Ends: ${sub.endDate}</p>
        ${alertText}
      </div>
      <div class="subscription-actions">
        <button onclick="editSubscription(${index})">Edit</button>
        <button onclick="removeSubscription(${index})">Remove</button>
      </div>
    `;
    list.appendChild(li);

    if (isTrialEnding) {
      showNotification(`Your trial for ${sub.name} is ending soon!`);
    }
  });
}

// Add or Update Subscription
function addOrUpdateSubscription(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const cost = parseFloat(document.getElementById('cost').value);
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  if (name && cost && startDate && endDate) {
    if (editingIndex !== null) {
      subscriptions[editingIndex] = { name, cost, startDate, endDate };
      editingIndex = null;
      document.querySelector('button[type="submit"]').innerText = 'Add Subscription';
    } else {
      subscriptions.push({ name, cost, startDate, endDate });
    }

    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    renderSubscriptions();
  }

  addSubscriptionForm.reset();
}

// Remove Subscription
function removeSubscription(index) {
  subscriptions.splice(index, 1);
  localStorage.setItem('subscriptions', JSON.stringify(subscriptions)); // Update localStorage
  renderSubscriptions();
}

// Edit Subscription
function editSubscription(index) {
  const sub = subscriptions[index];
  editingIndex = index;
  document.getElementById('name').value = sub.name;
  document.getElementById('cost').value = sub.cost;
  document.getElementById('startDate').value = sub.startDate;
  document.getElementById('endDate').value = sub.endDate;
  document.querySelector('button[type="submit"]').innerText = 'Update Subscription';
}

// Toggle Menu
function toggleMenu() {
  const menu = document.getElementById('dropdownMenu');
  menu.classList.toggle('show');
}

// Form Submit Handler
if (addSubscriptionForm) {
  addSubscriptionForm.addEventListener('submit', addOrUpdateSubscription);
}

window.onload = renderSubscriptions;
