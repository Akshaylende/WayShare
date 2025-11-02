from app import create_app


# Create an instance of the Flask application
app = create_app()


# This is the main entry point to run the application server
if __name__ == "__main__":
    # The debug=True flag enables auto-reloading when code changes
    # The port is set to 5050 as in the original file
    app.run(debug = True, port = 5050)
