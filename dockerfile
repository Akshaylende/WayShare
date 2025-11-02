# Use Official Python image
FROM python:3.11-slim

# set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port 
EXPOSE 5050

# Set environment variable for Flask
ENV FLASK_APP = run.py
ENV FLASK_ENV = development


# Run the app
CMD ["python", 'run.py']
