
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

// Simple function to handle accept/reject UI interaction
function handleRequest(cardId, action) {
    const card = document.getElementById(cardId);
    if (!card) return;

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
