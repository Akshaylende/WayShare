// Get the form element from the page
const signinform = document.getElementById('my-form');
const statusMessage = document.getElementById('response-message');

// 2. Add an event listener for the "submit" event
if (signinform) {
    signinform.addEventListener('submit', async (event) => {
        // 3. Prevent the default form submission behavior (page reload)
        event.preventDefault();

        // 4. Gather the form data using the FormData API
        const formData = new FormData(signinform);
        // Convert FormData to a plain JavaScript object
        const data = Object.fromEntries(formData.entries());

        // Optional: Log the data to the console to see what you're sending
        console.log('Sending data:', data);

        try {
            // 5. Construct the fetch POST request
            const response = await fetch('/login', { // Replace with your actual API endpoint
                method: 'POST',
                headers: {
                    // Tell the server we are sending JSON data
                    'Content-Type': 'application/json'
                },
                // Convert the JavaScript object to a JSON string
                body: JSON.stringify(data)
            });
            // 6. Handle the server's response
            if (response.ok) {
                // If the response status is 200-299 (successful)
                const result = await response.json(); // Assuming the server sends back JSON
                console.log('Success:', result);
                
                signinform.reset(); // Clear the form fields
                window.location.href = '/home';
            } else {
                // If the server returned an error (e.g., status 400, 500)
                const error = await response.json();
                console.error('Error:', error);
                statusMessage.textContent = `Error: ${error.message || 'Something went wrong.'}`;
                statusMessage.style.color = 'red';
            }
        }
        catch (error) {
            // This catches network errors (e.g., user is offline)
            console.error('Network Error:', error);
            statusMessage.textContent = 'Network error. Please try again later.';
            statusMessage.style.color = 'red';
        }
    });
}




// Handling New User Registration

const registerform = document.getElementById('register-form');
if (registerform) {
    registerform.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(registerform);

        const data = Object.fromEntries(formData.entries());

        console.log('Sending data:', data);
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // If the response status is 200-299 (successful)
                const result = await response.json(); // Assuming the server sends back JSON
                console.log('Success:', result);
                registerform.reset(); // Clear the form fields
                window.location.href = '/sign-in';
            } else {
                // If the server returned an error (e.g., status 400, 500)
                const error = await response.json();
                console.error('Error:', error);
                statusMessage.textContent = `Error: ${error.message || 'Something went wrong.'}`;
                statusMessage.style.color = 'red';
            }
        } catch (error) {
            // This catches network errors (e.g., user is offline)
            console.error('Network Error:', error);
            statusMessage.textContent = 'Network error. Please try again later.';
            statusMessage.style.color = 'red';
        }

    });
}
