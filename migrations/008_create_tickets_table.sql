CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    problem_description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
