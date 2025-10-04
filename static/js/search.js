const form = document.getElementById('search-form');
const resultsContainer = document.getElementById('search-results');
const categorySelect = document.getElementById('category');
const clearBtn = document.getElementById('clear-btn');

// Load categories on page load
async function renderCategoryOptions() {
  try {
    // fetch category API
    const res = await fetch('http://localhost:3000/api/category');
    // get json format events
    const categories = await res.json();
    // create option for each category
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading categories:', err);
  }
}

// Insert event card
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
  resultsContainer.appendChild(card);
}

// Handle search form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // get value from date, city and category input/select
  const date = document.getElementById('date').value;
  const city = document.getElementById('city').value.trim();
  const categoryId = document.getElementById('category').value;

  // build url using URL
  let url = new URL('http://localhost:3000/api/event/search-events');

  // append searchParams in URL object
  if (date) {
    url.searchParams.append('date', date)
  }
  if (city) {
    url.searchParams.append('city', city)
  }
  if (categoryId) {
    url.searchParams.append('categoryId', categoryId)
  }

  try {
    const res = await fetch(url);
    // get json format events
    const events = await res.json();
    resultsContainer.innerHTML = '';

    // Show 'No events found' when event length is equal to 0
    if (events.length === 0) {
      resultsContainer.innerHTML = '<p>No events found.</p>';
      return;
    }

    events.forEach(event => insertEventCard(event));
  } catch (err) {
    // Show error message
    console.error('Error searching events:', err);
    resultsContainer.innerHTML = '<p>Error loading events.</p>';
  }
});

// Handle clear filters
clearBtn.addEventListener('click', () => {
  document.getElementById('date').value = '';
  document.getElementById('city').value = '';
  document.getElementById('category').value = '';
  // Clear all events
  resultsContainer.innerHTML = '';
});

// render category options
renderCategoryOptions();
