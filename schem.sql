-- admin entity schema
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Ensure the updated_at field is automatically updated on row modification
CREATE OR REPLACE FUNCTION update_admin_updated_at()
-- car vendor entity schema
 CREATE TABLE IF NOT EXISTS car_vendor (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--customer entity schema
CREATE TABLE IF NOT EXISTS customer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- profile entity schema
CREATE TABLE IF NOT EXISTS profile (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    profile_picture VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Service entity schema
CREATE TABLE IF NOT EXISTS service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    duration INT NOT NULL, -- Duration in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- vehicle entity schema
CREATE TABLE IF NOT EXISTS vehicle (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    color VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- booking entity schema
CREATE TABLE IF NOT EXISTS booking (
    id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES service(id) ON DELETE CASCADE,
    vehicle_id INT NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
    vendor_id INT NOT NULL REFERENCES car_vendor(id) ON DELETE CASCADE,
    booking_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- e.g., pending, confirmed, completed, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- rating entity schema
CREATE TABLE IF NOT EXISTS rating (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(50) NULL, -- Optional vehicle ID if the rating is related to a specific vehicle
    service_id VARCHAR(50) NULL, -- Optional service ID if the rating is related to a specific service
    vendor_id VARCHAR(50) NULL, -- Optional vendor ID if the rating is related to a specific vendor
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating value, e.g., 1 to 5 stars
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- review entity schema
CREATE TABLE IF NOT EXISTS review (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating value, e.g., 1 to 5 stars
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- report entity schema
CREATE TABLE IF NOT EXISTS report (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES booking(id) ON DELETE CASCADE,
    customer_id INT NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
    reason TEXT NOT NULL, -- Reason for the report
    description TEXT, -- Additional details about the report
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- e.g., open, in_review, resolved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- relationship between entities
CREATE TABLE IF NOT EXISTS customer_vehicle (
    

