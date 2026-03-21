-- Table for storing user data
CREATE TABLE IF NOT EXISTS endpoint_metrics (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(24) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL,
    time_bucket TIMESTAMP NOT NULL,
    total_hits INTEGER DEFAULT 0,
    error_hits INTEGER DEFAULT 0,
    avg_latency NUMERIC(10,3) DEFAULT 0.000,
    min_latency NUMERIC(10,3) DEFAULT 0.000,
    max_latency NUMERIC(10,3) DEFAULT 0.000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(client_id, service_name, endpoint, method, time_bucket) -- Inseert | Update
);