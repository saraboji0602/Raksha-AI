# RAKSHA-AI Backend Production Dockerfile
FROM python:3.12-slim-bookworm

WORKDIR /app

# Install system GIS libraries & build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Set non-root user for container security
RUN useradd -m -u 1000 raksha && chown -R raksha:raksha /app
USER raksha

EXPOSE 8000

ENV PORT=8000 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
