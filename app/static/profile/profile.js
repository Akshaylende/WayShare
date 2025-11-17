document.addEventListener('DOMContentLoaded', function () {

    // --- PRE-EXISTING SCRIPT ---

    // Rating Stars (Demo)
    const stars = document.querySelectorAll('.star');
    const ratingNumber = document.querySelector('.rating-number');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            stars.forEach((s, i) => {
                s.classList.toggle('filled', i <= index);
                s.style.opacity = i <= index ? '1' : '0.3';
            });
            ratingNumber.textContent = (index + 1) + '.0';
        });
    });

    // Demo alert for Send Message/View Contacts
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Stop this script from running on the in-place edit buttons
            if (this.id === 'save-all-btn' || this.classList.contains('section-edit-btn') || this.classList.contains('section-add-btn') || this.id === 'cancel-vehicle-btn' || this.id === 'edit-personal-btn' || this.id === 'cancel-all-btn') {
                return;
            }
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            setTimeout(() => {
                alert(originalText + ' action clicked!');
                this.textContent = originalText;
            }, 500);
        });
    });

    // Vehicle Count
    const vehicleCountSpan = document.getElementById('vehicle-count');
    const vehicleList = document.getElementById('vehicle-list'); // Get list for delegation
    function updateVehicleCount() {
        const count = document.querySelectorAll('.vehicle-item').length;
        if (vehicleCountSpan)
            vehicleCountSpan.textContent = count;
    }
    updateVehicleCount(); // Initial count

    // Preference Count
    const prefCountSpan = document.getElementById('pref-count');
    function updatePrefCount() {
        // Count existing tags + new inputs
        const existingCount = document.querySelectorAll('.pref-tag-editable').length;
        if (prefCountSpan)
            prefCountSpan.textContent = existingCount;
    }
    updatePrefCount(); // Initial count

    // Date Formatting
    const joinedDateHeaderSpan = document.getElementById('joined-date');
    if (joinedDateHeaderSpan) {
        const rawTimestamp = joinedDateHeaderSpan.getAttribute('data-timestamp');
        const dateObj = new Date(rawTimestamp);
        const member = document.getElementById('joined');
        if (!isNaN(dateObj.getTime())) {
            const formatter = new Intl.DateTimeFormat('en-US', {
                month: 'short', // "Jun"
                year: 'numeric' // "2019"
            });
            const parts = formatter.formatToParts(dateObj);
            const month = parts.find(part => part.type === 'month').value;
            const year = parts.find(part => part.type === 'year').value;
            member.textContent = `${month} - ${year}`;
        } else {
            member.textContent = "Invalid Date";
        }
    }

    // --- NEW: IN-PLACE EDITING SCRIPT ---

    let isEditing = false;

    // Get Elements
    const saveAllBtn = document.getElementById('save-all-btn');
    const cancelAllBtn = document.getElementById('cancel-all-btn'); // NEW
    const editPersonalBtn = document.getElementById('edit-personal-btn');
    const mainContainer = document.querySelector('.container1'); // Get main container
    const personalDetailsSection = document.getElementById('personal-details-section');

    // --- REVISED: Get All Editable Elements ---
    const profileInfoSection = document.getElementById('profile-info-section');
    // Header fields
    const displayName = document.getElementById('display-name');
    const inputName = document.getElementById('input-name');
    const displayLocation = document.getElementById('display-location');
    const inputLocation = document.getElementById('input-location');
    const displayProfession = document.getElementById('display-profession');
    const inputProfession = document.getElementById('input-profession');
    // Personal Details fields
    const displayEmail = document.getElementById('display-email');
    const displayPhone = document.getElementById('display-phone');
    const inputEmail = document.getElementById('input-email');
    const inputPhone = document.getElementById('input-phone');

    // Get Preference Elements
    const prefSection = document.getElementById('pref-section');
    const addPrefBtn = document.getElementById('add-pref-btn');
    const prefTagsList = document.getElementById('pref-tags-list');
    const newPrefList = document.getElementById('new-pref-list'); // This is no longer used for input

    // --- NEW: Vehicle Edit Elements ---
    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    const vehicleModal = document.getElementById('add-vehicle-modal');
    const cancelVehicleBtn = document.getElementById('cancel-vehicle-btn');
    const vehicleForm = document.getElementById('vehicle-form');
    const vehicleSection = document.getElementById('vehicle-section');


    // --- NEW: Helper function to create/add tags ---
    function createAndAddPrefTag(value) {
        const newTag = document.createElement('div');
        newTag.className = 'pref-tag-editable';
        newTag.innerHTML = `
                <span>${value}</span>
                <button type="button" class="pref-remove-btn" title="Remove preference">&times;</button>
            `; // BUG FIX: Removed inline style from button
        prefTagsList.appendChild(newTag);
        updatePrefCount();
    }

    // --- NEW: Data Collection & POST Request Function ---
    function sendDataToServer() {
        console.log("Collecting data to send to server...");

        // 1. Collect all data from the display elements
        // We read from the display elements because toggleEditMode(true)
        // has already updated them from the inputs.
        console.log(Array.from(vehicleList.querySelectorAll('.vehicle-item')));
        const payload = {
            name: displayName.textContent.trim(),
            location: displayLocation.textContent.replace('Location📍- ', '').trim(),
            profession: displayProfession.textContent.replace('Profession - ', '').trim(),
            email: displayEmail.textContent.trim(),
            phone: displayPhone.textContent.trim(),

            // Collect preferences
            preferences: Array.from(prefTagsList.querySelectorAll('.pref-tag-editable > span'))
                .map(span => span.textContent.trim()),


            
            // Collect vehicles
            vehicles: Array.from(vehicleList.querySelectorAll('.vehicle-item'))
                .map(item => {
                    return {
                        name: item.children[1].innerText,
                        plate: item.children[2].children[0].innerText.split(': ')[1],
                        color: item.children[2].children[1].innerText.split(': ')[1],
                        seats: item.children[2].children[2].innerText.split(': ')[1],
                        type: item.children[2].children[3].innerText.split(': ')[1]
                    };
                })
        };

        console.log("Payload to send:", payload);

        // 2. Send the POST request
        // Replace '/save-profile-data' with your actual Flask endpoint
        fetch('/save-profile-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // In a real Flask-WTF app, you'd add a CSRF token
                // 'X-CSRFToken': '{{ csrf_token() }}' 
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Server responded with ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Server response:', data);
                // Optionally show a more advanced success message
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Error updating profile. Changes were not saved. See console for details.');
            });
    }


    function toggleEditMode(saveChanges) {
        if (isEditing) {
            // --- We are SAVING or CANCELING ---
            mainContainer.classList.remove('is-editing');
            profileInfoSection.classList.remove('is-editing'); // NEW
            personalDetailsSection.classList.remove('is-editing');
            prefSection.classList.remove('is-editing');
            vehicleSection.classList.remove('is-editing');

            if (saveChanges) {
                // Save new values from input to span
                displayName.textContent = inputName.value;
                displayLocation.textContent = "Location📍- " + inputLocation.value;
                displayProfession.textContent = "Profession - " + inputProfession.value;
                displayEmail.textContent = inputEmail.value;
                displayPhone.textContent = inputPhone.value;

                // --- REVISED: Save new preferences ---
                // Save any *remaining* new inputs
                prefTagsList.querySelectorAll('.pref-tag-input').forEach(input => {
                    const value = input.value.trim();
                    if (value) {
                        createAndAddPrefTag(value); // Use the helper
                    }
                    input.closest('.pref-tag-editable').remove(); // Remove the input-tag
                });

                console.log('Saving changes...');
                // --- NEW: Send all data to server ---
                sendDataToServer();

            } else {
                // Cancel: revert input values to span text
                inputName.value = displayName.textContent;
                // Handle text prefixes when canceling
                inputLocation.value = displayLocation.textContent.replace('Location📍- ', '').trim();
                inputProfession.value = displayProfession.textContent.replace('Profession - ', '').trim();
                inputEmail.value = displayEmail.textContent;
                inputPhone.value = displayPhone.textContent;

                // --- Clean up ---
                // Remove any new preference inputs that were added
                prefTagsList.querySelectorAll('.new-tag-input').forEach(el => el.remove());
            }

            // Hide Save/Cancel buttons
            saveAllBtn.classList.add('hidden');
            cancelAllBtn.classList.add('hidden');
            // Show Edit button
            editPersonalBtn.classList.remove('hidden');

            isEditing = false;

        } else {
            // --- We are starting to EDIT ---

            // Pre-fill inputs
            inputName.value = displayName.textContent.trim();
            inputLocation.value = displayLocation.textContent.replace('Location📍- ', '').trim();
            inputProfession.value = displayProfession.textContent.replace('Profession - ', '').trim();
            inputEmail.value = displayEmail.textContent.trim();
            inputPhone.value = displayPhone.textContent.trim();

            // Show inputs, hide spans, show edit buttons
            mainContainer.classList.add('is-editing');
            profileInfoSection.classList.add('is-editing'); // NEW
            personalDetailsSection.classList.add('is-editing');
            prefSection.classList.add('is-editing');
            vehicleSection.classList.add('is-editing');

            // Toggle Save/Edit buttons
            saveAllBtn.classList.remove('hidden');
            cancelAllBtn.classList.remove('hidden'); // NEW
            editPersonalBtn.classList.add('hidden');

            isEditing = true;
        }
        // Update counts
        updatePrefCount();
        updateVehicleCount();
    }

    // --- REVISED: Add Preference Input ---
    function addNewPreferenceInput() {
        // Create the container
        const tagContainer = document.createElement('div');
        tagContainer.className = 'pref-tag-editable new-tag-input';

        // Create the input
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'pref-tag-input';
        input.placeholder = 'Type & press Enter...';

        // --- NEW: Enter Key Logic ---
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Stop page reload
                const value = this.value.trim();
                if (value) {
                    // Create and add the *final* tag
                    createAndAddPrefTag(value);
                }
                // Remove the temporary input-tag
                tagContainer.remove();
                updatePrefCount(); // Update count
            }
        });

        tagContainer.appendChild(input);
        prefTagsList.appendChild(tagContainer); // Add to the main list
        input.focus();
        updatePrefCount(); // Update count
    }

    // --- NEW: Remove Preference (Event Delegation) ---
    prefTagsList.addEventListener('click', function (e) {
        if (e.target.classList.contains('pref-remove-btn')) {
            e.target.closest('.pref-tag-editable').remove();
            updatePrefCount();
        }
    });

    // --- NEW: Vehicle Modal Logic ---
    addVehicleBtn.addEventListener('click', () => {
        if (isEditing) {
            vehicleModal.classList.remove('hidden');
        } else {
            alert('Please click the main Edit button in the top-right corner to start making changes.');
        }
    });
    cancelVehicleBtn.addEventListener('click', () => {
        vehicleModal.classList.add('hidden');
        vehicleForm.reset();
    });

    vehicleForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('input-vehicle-name').value;
        const plate = document.getElementById('input-vehicle-plate').value;
        const color = document.getElementById('input-vehicle-color').value;
        const seats = document.getElementById('input-vehicle-seats').value;
        const type = document.getElementById('input-vehicle-type').value;

        createAndAddVehicleItem(name, plate, color, seats, type);

        vehicleModal.classList.add('hidden');
        vehicleForm.reset();
    });

    // Helper to create vehicle HTML
    function createAndAddVehicleItem(name, plate, color, seats, type) {
        const newItem = document.createElement('div');
        newItem.className = 'vehicle-item';

        // --- NEW: Add data attributes for saving ---
        newItem.dataset.name = name;
        newItem.dataset.plate = plate;
        newItem.dataset.color = color;
        newItem.dataset.seats = seats;
        newItem.dataset.type = type;


        // BUG FIX: Corrected typo `div classReadMe` to `div class="vehicle-details"`
        newItem.innerHTML = `
                <button type="button" class="vehicle-remove-btn" title="Remove vehicle">&times;</button>
                <div class="vehicle-name">
                    ${name}
                </div>
                <div class="vehicle-details">
                    <div class="vehicle-detail">Plate: <strong>${plate}</strong></div>
                    <div class="vehicle-detail">Color: <strong>${color}</strong></div>
                    <div class="vehicle-detail">Seats: <strong>${seats}</strong></div>
                    <div class="vehicle-detail">Type: <strong>${type}</strong></div>
                </div>
            `;
        vehicleList.appendChild(newItem);
        updateVehicleCount();
    }

    // Remove Vehicle (Event Delegation)
    vehicleList.addEventListener('click', function (e) {
        if (e.target.classList.contains('vehicle-remove-btn')) {
            e.target.closest('.vehicle-item').remove();
            updateVehicleCount();
        }
    });


    // Attach Event Listeners
    // REVISED: Toggle logic now handles both "Edit" and "Cancel"
    editPersonalBtn.addEventListener('click', () => toggleEditMode(false));
    saveAllBtn.addEventListener('click', () => toggleEditMode(true));
    cancelAllBtn.addEventListener('click', () => toggleEditMode(false)); // NEW
    addPrefBtn.addEventListener('click', addNewPreferenceInput);

});
