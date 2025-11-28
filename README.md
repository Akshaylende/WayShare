## WayShare


The web app is under development is in inprogress state. Some features have just basic Alert handling as that feature is yet to be released. 
you can check it out live on  - https://wayshare.onrender.com/













Steps Took - 
1. Create virtual Environment - Python -m venv venv
2. Activate the virtual environment venv\Acripts\Activate.ps1
3. Install flask from the terminal in the virtual environment
4. To run the app -> python run.py












Flow  -> run.py -> __init__.py -> routes.py -> helpers.py
                                    |-> templates -> home.html




so far DB 
    db - 1. users
         2. rides
         3. record
         4. registry





# Build the image
docker build -t wayshare-app .

# Run the container
docker run -p 5050:5000 wayshare-app





###
Hiding edit button for users other than own profile