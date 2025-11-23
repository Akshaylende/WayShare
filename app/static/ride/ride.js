//   // --- Date Formatting Logic (from rides_feed.html) ---
//         function formatDateTime(dateStr, timeStr) {
//             const date = new Date(`${dateStr}T${timeStr}`);
//             if (isNaN(date.getTime())) return "Invalid Date/Time";
//             return new Intl.DateTimeFormat('en-US', {
//                 weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
//             }).format(date);
//         }

//         function formatAllRideTimes() {
//             document.querySelectorAll('.format-me').forEach(el => {
//                 const dateStr = el.getAttribute('data-date');
//                 const timeStr = el.getAttribute('data-time');
//                 if (dateStr && timeStr) {
//                     el.textContent = formatDateTime(dateStr, timeStr);
//                 }
//             });
//         }

//         // --- INITIALIZE ---
//         document.addEventListener('DOMContentLoaded', () => {
//             formatAllRideTimes();
//             // In a real app, you would use the URL parameter (e.g., ?id=1) 
//             // to fetch this data from your backend.
//             console.log("Ride Detail Page Loaded.");
//         });


function formatDateTime(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}`);

    if (isNaN(date.getTime())) {
        return "Invalid Date/Time";
    }

    const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

// Example Usage:
// const dateString = '2025-11-15';
// const timeString = '18:15';
// const formatted = formatDateTime(dateString, timeString);

// console.log(formatted); // Output: Sat, Nov 15, 6:15 PM
function formatRideTimes() {
    const elementsToFormat = document.querySelector('.ride-time');
    const dateStr = elementsToFormat.getAttribute('data-date');
    const timeStr = elementsToFormat.getAttribute('data-time');
    // console.log(dateStr);
    // console.log(timeStr);
    if (dateStr && timeStr)
        elementsToFormat.textContent = formatDateTime(dateStr, timeStr);
}

// 3. Run it when the page loads
document.addEventListener('DOMContentLoaded', formatRideTimes());



function formatDateTime(dateStr, timeStr) {
    const date = new Date(`${dateStr}T${timeStr}`);
    if (isNaN(date.getTime())) return "Invalid Date/Time";
    return new Intl.DateTimeFormat('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
    }).format(date);
}

function formatAllRideTimes() {
    document.querySelectorAll('.format-me').forEach(el => {
        const dateStr = el.getAttribute('data-date');
        const timeStr = el.getAttribute('data-time');
        if (dateStr && timeStr) {
            el.textContent = formatDateTime(dateStr, timeStr);
        }
    });
}

// --- NEW: Seat Stepper Logic ---
function setupSeatStepper() {
    const minusBtn = document.getElementById('seat-minus');
    const plusBtn = document.getElementById('seat-plus');
    const countInput = document.getElementById('seat-count');
    const bookBtn = document.getElementById('book-button');
    const availabilityEl = document.querySelector('#seats-available p');

    // 1. Get max seats from the "Availability" text
    let maxSeats = 2; // Default
    if (availabilityEl) {
        const availabilityText = availabilityEl.textContent || "2 Seats"; // e.g., "2 Seats"
        maxSeats = parseInt(availabilityText.split(' ')[0]) || 2;
    }

    let currentCount = 1;

    // 2. Function to update button states and text
    function updateState() {
        if (countInput)
            countInput.value = currentCount;

        // Update button text
        if (bookBtn)
            bookBtn.textContent = `Book ${currentCount} Seat${currentCount > 1 ? 's' : ''}`;

        // Update disabled states
        if (minusBtn)
            minusBtn.disabled = currentCount === 1;
        if (plusBtn)
            plusBtn.disabled = currentCount === maxSeats;
    }

    // 3. Add Click Listeners
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            if (currentCount < maxSeats) {
                currentCount++;
                updateState();
            }
        });
    }

    if (minusBtn) {
        minusBtn.addEventListener('click', () => {
            if (currentCount > 1) {
                currentCount--;
                updateState();
            }
        });
    }

    // 4. Initial state
    updateState();
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    formatAllRideTimes();
    setupSeatStepper(); // Initialize the new stepper
    console.log("Ride Detail Page Loaded.");
});

function send_booking() {
    console.log("Collecting data to send to server...");
    const countInput = document.getElementById('seat-count').value;
    const ride_id = window.location.href.split('/').reverse()[0];
    const payload = {
        ride: ride_id,
        seats_requested: countInput,
    };
    console.log("Payload to send:", payload);


    fetch('/create-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // In a real Flask-WTF app, you'd add a CSRF token
            // 'X-CSRFToken': '{{ csrf_token() }}' 
        },
        body: JSON.stringify(payload)
    })
    .then(async response => {
        // We define 'data' here so it's available in both blocks
        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            // If response is not ok (e.g., 400, 500), throw an error with the server's message
            // This allows us to see "Not enough seats" or other specific errors
            const errorMessage = data.message || `Server Error: ${response.status}`;
            throw new Error(errorMessage);
        }
    })
    .then(data => {
        // --- SUCCESS BLOCK ---
        console.log('Success:', data);
        alert('Booking Request Sent Successfully! Redirecting to your rides...');
        window.location.href = '/rides';
    })
    .catch(error => {
        // --- ERROR BLOCK ---
        console.error('Booking Failed:', error);
        // Show the specific error message to the user
        alert(`Booking Failed: ${error.message}`);
    });
}