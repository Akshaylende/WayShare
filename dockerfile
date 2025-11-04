# Use Official Python image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 5000

# Set environment variables (NO spaces around =)
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# Run the app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "run:create_app()"]


# CMD ["python", 'run.py']
