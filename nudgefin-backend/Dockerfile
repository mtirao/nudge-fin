# 1. Use an official, lightweight Python base image
FROM python:3.10-slim

# 2. Set system environment variables
# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE=1
# Prevents Python from buffering stdout and stderr (essential for clean logs)
ENV PYTHONUNBUFFERED=1

# 3. Set the active working directory inside the container
WORKDIR /app

# 4. Install system dependencies needed for compiler utilities if any
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy only the dependency file first to leverage Docker caching layers
COPY requirements.txt /app/

# 6. Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# 7. Copy the rest of the backend application code into the container
COPY . /app/

# 8. Expose the port FastAPI runs on
EXPOSE 8000

# 9. Command to spin up the production Uvicorn ASGI server binds to port 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
