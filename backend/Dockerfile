# Use an official, lightweight Python Alpine image
FROM python:3.11-alpine

# Set working directory inside the container
WORKDIR /app

# Install system dependencies needed to compile certain Python packages (like psycopg2 for Postgres)
RUN apk add --no-cache gcc musl-dev postgresql-dev libffi-dev

# Copy only requirements first to leverage Docker caching layers
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend application code
COPY . .

# Expose the API port
EXPOSE 8000

# Command to run your app (Uncomment the one you decide to use!)
# For FastAPI:
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

# For Flask:
# CMD ["flask", "run", "--host=0.0.0.0", "--port=8000"]