
// Function to switch tabs
function switchTab(tabName) {
    // 1. Reset all tabs to inactive
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    // 2. Activate the selected tab
    const buttons = document.querySelectorAll('.tab-btn');
    if (tabName === 'incoming') {
        buttons[0].classList.add('active');
        document.getElementById('tab-incoming').classList.add('active');
    } else {
        buttons[1].classList.add('active');
        document.getElementById('tab-sent').classList.add('active');
    }
}
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.getElementById('incoming-count');
    function updateIncomingCount() {
        const count = document.getElementsByClassName('request-card').length;
        if (cards)
            cards.textContent = count;
    }
    updateIncomingCount(); 

    const cards2 = document.getElementById('sent-count');
    function updateSentCount() {
        const count2 = document.getElementsByClassName("my-req-details").length;
        if (cards2)
            cards2.textContent = count2;
    }
    updateSentCount(); 
});

// Simple function to handle accept/reject UI interaction
function handleRequest(cardId, action) {
    const card = document.getElementById(cardId);
    if (!card) return;
    // console.log(cardId);
    const booking_id = document.getElementsByClassName('request-actions')[0].dataset.value;
    const seats = document.getElementsByClassName('req-meta')[0].dataset.value
    const payload = {
        booking: cardId,
        action: action
    };
    console.log("Payload to send:", payload);


    fetch('/ride-booking', {
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
        // alert('Booking Request Sent Successfully! Redirecting to your rides...');
        // window.location.href = '/rides';
    })
    .catch(error => {
        // --- ERROR BLOCK ---
        console.error('Booking Failed:', error);
        // Show the specific error message to the user
        // alert(`Booking Failed: ${error.message}`);
    });
    // Replace content with a success/message
    if (action === 'accepted') {
        card.style.background = '#ECFDF5'; // Light green
        card.style.borderColor = '#10B981';
        card.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #059669; font-weight: 600;">
                        <i class="fas fa-check-circle mr-2"></i> Booking Accepted!
                    </div>
                `;
    } else {
        card.style.background = '#FEF2F2'; // Light red
        card.style.borderColor = '#EF4444';
        card.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #B91C1C; font-weight: 600;">
                        <i class="fas fa-times-circle mr-2"></i> Request Rejected
                    </div>
                `;
    }

    // Optional: Remove card after delay
    setTimeout(() => {
        card.style.opacity = '0';
        setTimeout(() => card.remove(), 500);
    }, 2000);
}
