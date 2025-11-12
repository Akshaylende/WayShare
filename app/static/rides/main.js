function filterRides() {
    let input_date = document.getElementById('search-input-date').value;
    if(input_date)
        console.log(input_date);
    let destination = document.getElementById('search-input-destination').value;
    console.log(destination)

    let base_url = `/rides`
    if(input_date && destination){
        base_url = `${base_url}?date=${input_date}&destination=${destination}`;
    }
    else if(input_date){
        base_url = `${base_url}?date=${input_date}`;
    }
    else if(destination){
        base_url = `${base_url}?destination=${destination}`
    }
    // alert(base_url);
    window.location.href = base_url;
}

// Trigger search on 'Enter' key


let filter_button = document.getElementById('search-input')


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
function formatAllRideTimes() {
    const elementsToFormat = document.querySelectorAll(".ride-time");

    elementsToFormat.forEach(el => {
        const dateStr = el.getAttribute('data-date');
        const timeStr = el.getAttribute('data-time');

        if (dateStr && timeStr) {
            el.textContent = formatDateTime(dateStr, timeStr);
        }
    });
}

// 3. Run it when the page loads
document.addEventListener('DOMContentLoaded', formatAllRideTimes());


let currentPage = 1;
const ridesPerPage = 5;
let currentFilteredRides = []; // Holds the list of currently visible rides after filtering

function applyFilterAndPagination(filterText = "") {
    const allRides = Array.from(document.querySelectorAll('.rides-list .ride-card'));

    // 1. First, apply search filter to get the list of relevant rides
    currentFilteredRides = allRides.filter(card => {
        const destination = card.getAttribute('data-destination');
        return !filterText || (destination && destination.toUpperCase().indexOf(filterText) > -1);
    });

    // 2. Handle "No Results" state
    document.getElementById('no-rides-msg').style.display = currentFilteredRides.length === 0 ? 'block' : 'none';
    document.getElementById('pagination-controls').style.display = currentFilteredRides.length === 0 ? 'none' : 'flex';

    if (currentFilteredRides.length === 0) {
        // Hide all if no matches
        allRides.forEach(card => card.style.display = 'none');
        return;
    }

    // 3. Calculate total pages based on filtered results
    const totalPages = Math.ceil(currentFilteredRides.length / ridesPerPage);

    // Ensure current page is valid after filtering
    if (currentPage > totalPages) currentPage = 1;

    // 4. Determine start and end indices for current page
    const startIndex = (currentPage - 1) * ridesPerPage;
    const endIndex = startIndex + ridesPerPage;

    // 5. Show/Hide rides based on pagination
    allRides.forEach(card => card.style.display = 'none'); // Hide all first
    for (let i = startIndex; i < endIndex && i < currentFilteredRides.length; i++) {
        currentFilteredRides[i].style.display = 'block'; // Show only ones for this page
    }

    // 6. Update Pagination Controls
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// Pagination Button Event Listeners
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        // Pass current search filter value to keep it active
        applyFilterAndPagination(document.getElementById('search-input').value.toUpperCase());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(currentFilteredRides.length / ridesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        applyFilterAndPagination(document.getElementById('search-input').value.toUpperCase());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', () => {
    formatAllRideTimes();
    applyFilterAndPagination(); // Initial load (shows page 1 of all rides)
});


// function onRideClick(){
//     alert('This feature is in development phase and will be released on 11-11-2025')
// }