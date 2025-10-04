const container = document.getElementById('events-container');

// Load events on homepage
async function init() {
  try {
    // fetch API
    const res = await fetch('http://localhost:3000/api/event');
    // get json format events
    const events = await res.json();
    // clear container
    container.innerHTML = '';

    if (events.length === 0) {
      container.innerHTML = '<p>No currently events found.</p>';
      return;
    }

    // insert each event card
    events.forEach(event => insertEventCard(event));
  } catch (err) {
    console.error('Error loading events:', err);
  }
}

function insertEventCard(event) {
  // create evenbt card div
  const card = document.createElement('div');
  // add class
  card.classList.add('event-card');
  // insert html
  card.innerHTML = `
      <img src="${event.image_url}" alt="${event.name}" />
      <div class="event-card-content">
        <h3>${event.name}</h3>
        <p><strong>Category:</strong> ${event.category_name}</p>
        <p><strong>Location:</strong> ${event.city}, ${event.state_region}</p>
        <p><strong>Date:</strong> ${new Date(event.start_at).toLocaleString()}</p>
        <a href="event.html?id=${event.id}" class="btn">View Details</a>
      </div>
    `;
  // append to container
  container.appendChild(card);
}

init()
