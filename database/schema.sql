CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,

    registration_number VARCHAR(30) UNIQUE NOT NULL,

    full_name VARCHAR(150) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(15) NOT NULL,

    college_name VARCHAR(200) NOT NULL,

    department VARCHAR(100) NOT NULL,

    year_of_study VARCHAR(20) NOT NULL,

    event_name VARCHAR(100) NOT NULL,

    participation_type VARCHAR(20) NOT NULL,

    team_name VARCHAR(100),

    team_members TEXT,

    transaction_id VARCHAR(100) NOT NULL,

    payment_screenshot VARCHAR(255),

    registration_fee NUMERIC(10,2) DEFAULT 250.00,

    status VARCHAR(30) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);