

document.addEventListener("DOMContentLoaded", function () {

    const dateInput = document.getElementById('departure_date');
    const timeInput = document.getElementById('departure_time');

    let initialToday = new Date();
    const millisecondsIn530Hours = 5.5 * 60 * 60 * 1000;
    const currenttime = initialToday.getTime();

    initialToday = new Date(currenttime+millisecondsIn530Hours);
    // console.log(.toISOString())

    const today = initialToday.toISOString();
    const val = today.split('T')[0]
    if (dateInput)
        dateInput.min = val;

    // console.log(today)
    let timestring = today.split('T')[1].split(':')
    const time = `${timestring[0]}:${timestring[1]}`
    // console.log(dateInput.min);
    // console.log(time)
    if(timeInput)
        timeInput.disabled = true;


    function validateTimeForDate() {

        // Get the selected date value
        const selectedDate = dateInput.value;
        
        if(timeInput)
            timeInput.disabled = false;

        if(selectedDate == dateInput.min && timeInput.value < time ){
            timeInput.value = ""
            timeInput.min = time
        }

    }

    // Add the event listener to the date input
    if(dateInput || timeInput){
        dateInput.addEventListener('input', validateTimeForDate);
        timeInput.addEventListener('input', validateTimeForDate);
    }

    // // Demo alert for Send Message/View Contacts
    // document.querySelectorAll('.btn').forEach(btn => {
    //     btn.addEventListener('click', function () {
    //         // Stop this script from running on the in-place edit buttons
    //         if (this.id === 'save-all-btn' || this.classList.contains('section-edit-btn') || this.classList.contains('section-add-btn') || this.id === 'cancel-vehicle-btn' || this.id === 'edit-personal-btn' || this.id === 'cancel-all-btn') {
    //             return;
    //         }
    //         const originalText = this.textContent;
    //         this.textContent = 'Loading...';
    //         setTimeout(() => {
    //             alert(originalText + ' action clicked!');
    //             this.textContent = originalText;
    //         }, 500);
    //     });
    // });
    
});