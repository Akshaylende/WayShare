document.addEventListener('DOMContentLoaded', function() {
        // Interactive Rating Stars
        const stars = document.querySelectorAll('.star');
        const ratingNumber = document.querySelector('.rating-number');

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                // Update visual stars
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('filled');
                        s.style.opacity = '1';
                    } else {
                        s.classList.remove('filled');
                        s.style.opacity = '0.3';
                    }
                });
                // Update rating number for demo
                ratingNumber.textContent = (index + 1) + '.0';
            });
        });

        // Simple alert for buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const originalText = this.textContent;
                this.textContent = 'Loading...';
                setTimeout(() => {
                    alert(originalText + ' action clicked!');
                    this.textContent = originalText;
                }, 500);
            });
        });

        const vehicleCountSpan = document.getElementById('vehicle-count');
        // 3. Count how many elements have the class '.vehicle-item' inside the list
        const count = document.querySelectorAll('.vehicle-item').length;

        // 4. Update the text content of the span with the new count
        vehicleCountSpan.textContent = count;

        const prefCountSpan = document.getElementById('pref-count');
        // console.log(prefCountSpan)
        const count1 = document.querySelectorAll('.pref-tag').length;
        prefCountSpan.textContent = count1




        const joinedDateHeaderSpan = document.getElementById('joined-date');
        if (joinedDateHeaderSpan) {
            const rawTimestamp = joinedDateHeaderSpan.getAttribute('data-timestamp');
            // Create a Date object from the timestamp string
            const dateObj = new Date(rawTimestamp);
            
            const member = document.getElementById('joined');
            // Check if the date is valid before formatting
            if (!isNaN(dateObj.getTime())) {
                // Use Intl.DateTimeFormat for easy and localized formatting
                const formatter = new Intl.DateTimeFormat('en-US', {
                    month: 'short', // "Jun"
                    year: 'numeric' // "2019"
                });
                
                // Format the date. Output will be something like "Jun 2019"
                const parts = formatter.formatToParts(dateObj);
                const month = parts.find(part => part.type === 'month').value;
                const year = parts.find(part => part.type === 'year').value;
                

                member.textContent = `${month} - ${year}`;
            } else {
                member.textContent = "Invalid Date";
            }
        }



    });


