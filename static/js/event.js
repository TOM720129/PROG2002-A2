const container = document.getElementById('event-container');
const name = document.getElementById('name');
const description = document.getElementById('description');

// Get event ID from URL
const urlParams = new URLSearchParams(window.location.search);
const eventId = urlParams.get('id');

// Format cents to currency
function formatCurrency(cents, currency) {
  return (cents / 100).toLocaleString(undefined, {
    style: 'currency',
    currency: currency
  });
}

// Render event details
async function renderEvent() {
  if (!eventId) {
    container.innerHTML = '<p>Event ID not specified.</p>';
    return;
  }

  try {
    // fetch API
    const res = await fetch(`http://localhost:3000/api/event/events/${eventId}`);
    if (res.status === 404) {
      container.innerHTML = '<p>Event not found.</p>';
      return;
    }
    // get json format events
    const event = await res.json();

    // Calculate progress percentage
    let progressPercent = 0;
    if (event.goal_amount_cents) {
      progressPercent = Math.min(100, Math.round((event.amount_raised_cents / event.goal_amount_cents) * 100));
    }

    // Set name and short description
    name.innerHTML = event.name;
    description.innerHTML = event.short_description;

    // Set event detail card
    container.innerHTML = `
        <div class="event-card event-details-card">
            <img src="${event.image_url}" alt="${event.name}" />
            <div class="event-card-content">
                <h2>${event.name}</h2>
                <p><strong>Organization:</strong> ${event.organization_name}</p>
                <p><strong>Category:</strong> ${event.category_name}</p>
                <p><strong>Description:</strong> ${event.full_description || event.short_description}</p>
                <p><strong>Venue:</strong> ${event.venue_name || '-'} | ${event.venue_address || '-'} | ${event.city}, ${event.state_region}, ${event.postcode}, ${event.country}</p>
                <p><strong>Date:</strong> ${new Date(event.start_at).toLocaleString()} - ${new Date(event.end_at).toLocaleString()}</p>
                <p><strong>Ticket Price:</strong> ${formatCurrency(event.ticket_price_cents, event.currency)}</p>
                <p><strong>Tickets Sold:</strong> ${event.tickets_sold} / ${event.tickets_total || 'Unlimited'}</p>
                ${event.goal_amount_cents ? `
                    <p><strong>Fundraising Goal:</strong> ${formatCurrency(event.goal_amount_cents, event.currency)}</p>
                    <p><strong>Amount Raised:</strong> ${formatCurrency(event.amount_raised_cents, event.currency)}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${progressPercent}%"></div>
                    </div>
                    <p>${progressPercent}% of goal achieved</p>
                ` : ''}
                 <button type="button" id="clear-btn" class="btn btn-clear" onclick="alert('This feature is currently under construction.')">Register</button>
            </div>
        </div>
    `;
  } catch (err) {
    // Show error message
    console.error('Error loading event details:', err);
    container.innerHTML = '<p>Error loading event details.</p>';
  }
}

renderEvent();
