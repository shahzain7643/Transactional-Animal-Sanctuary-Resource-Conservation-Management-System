

SET search_path TO public;



CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE userroles (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);



CREATE TABLE species (
    species_id SERIAL PRIMARY KEY,
    common_name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(150) UNIQUE,
    requires_permit BOOLEAN DEFAULT FALSE
);

CREATE TABLE conservationstatus (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) UNIQUE NOT NULL,
    funding_priority BOOLEAN DEFAULT FALSE
);

CREATE TABLE animals (
    animal_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    species_id INT REFERENCES species(species_id),
    status_id INT REFERENCES conservationstatus(status_id),
    intake_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male','Female')),
    health_status VARCHAR(100),
    adoption_status VARCHAR(50) DEFAULT 'Available'
        CHECK (adoption_status IN ('Available','Adopted','Fostered','Medical','Unavailable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE medicines (
    medicine_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    quantity_in_stock INT NOT NULL CHECK (quantity_in_stock >= 0)
);

CREATE TABLE medicalrecords (
    record_id SERIAL PRIMARY KEY,
    animal_id INT REFERENCES animals(animal_id) ON DELETE CASCADE,
    staff_id INT REFERENCES users(user_id),
    treatment_description TEXT NOT NULL,
    medicine_id INT REFERENCES medicines(medicine_id),
    quantity_used INT CHECK (quantity_used > 0),
    treatment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventorytransactions (
    transaction_id SERIAL PRIMARY KEY,
    medicine_id INT REFERENCES medicines(medicine_id),
    transaction_type VARCHAR(20)
        CHECK (transaction_type IN ('IN','OUT')),
    quantity INT CHECK (quantity > 0),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reference_note TEXT
);



CREATE TABLE fosterhomes (
    foster_home_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    address TEXT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fosterassignments (
    assignment_id SERIAL PRIMARY KEY,
    animal_id INT UNIQUE REFERENCES animals(animal_id) ON DELETE CASCADE,
    foster_home_id INT REFERENCES fosterhomes(foster_home_id),
    start_date DATE NOT NULL,
    end_date DATE
);


CREATE TABLE adoptionapplications (
    application_id SERIAL PRIMARY KEY,
    animal_id INT REFERENCES animals(animal_id),
    adopter_id INT REFERENCES users(user_id),
    admin_id INT REFERENCES users(user_id),
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'Pending'
        CHECK (status IN ('Pending','Approved','Rejected')),
    review_date TIMESTAMP
);

CREATE TABLE adoptions (
    adoption_id SERIAL PRIMARY KEY,
    application_id INT UNIQUE REFERENCES adoptionapplications(application_id),
    adoption_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    adoption_fee NUMERIC(10,2) CHECK (adoption_fee >= 0),
    payment_status VARCHAR(20)
        CHECK (payment_status IN ('Pending','Paid'))
);

CREATE TABLE permits (
    permit_id SERIAL PRIMARY KEY,
    adopter_id INT REFERENCES users(user_id),
    animal_id INT REFERENCES animals(animal_id),
    issued_by INT REFERENCES users(user_id),
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    UNIQUE (adopter_id, animal_id)
);



CREATE TABLE donations (
    donation_id SERIAL PRIMARY KEY,
    donor_id INT REFERENCES users(user_id),
    amount NUMERIC(12,2) CHECK (amount > 0),
    donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    reference_note TEXT
);

CREATE TABLE financialledger (
    ledger_id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20)
        CHECK (transaction_type IN ('Donation','AdoptionFee','Expense')),
    reference_id INT,
    amount NUMERIC(12,2) NOT NULL,
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);



CREATE INDEX idx_animals_name ON animals(name);
CREATE INDEX idx_animals_adoption_status ON animals(adoption_status);
CREATE INDEX idx_financialledger_transaction_type ON financialledger(transaction_type);
CREATE INDEX idx_adoptionapplications_adopter_id ON adoptionapplications(adopter_id);



CREATE OR REPLACE FUNCTION check_medicine_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT quantity_in_stock FROM medicines WHERE medicine_id = NEW.medicine_id)
       < NEW.quantity_used THEN
        RAISE EXCEPTION 'Not enough medicine in stock';
    END IF;

    UPDATE medicines
    SET quantity_in_stock = quantity_in_stock - NEW.quantity_used
    WHERE medicine_id = NEW.medicine_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_foster_capacity()
RETURNS TRIGGER AS $$
DECLARE
    current_count INT;
    max_capacity INT;
BEGIN
    SELECT COUNT(*) INTO current_count
    FROM fosterassignments
    WHERE foster_home_id = NEW.foster_home_id
    AND end_date IS NULL;

    SELECT capacity INTO max_capacity
    FROM fosterhomes
    WHERE foster_home_id = NEW.foster_home_id;

    IF current_count >= max_capacity THEN
        RAISE EXCEPTION 'Foster home capacity exceeded';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION enforce_permit_for_endangered()
RETURNS TRIGGER AS $$
DECLARE
    is_endangered BOOLEAN;
    permit_exists BOOLEAN;
BEGIN
    SELECT (status_name = 'Endangered') INTO is_endangered
    FROM conservationstatus cs
    JOIN animals a ON a.status_id = cs.status_id
    WHERE a.animal_id = NEW.animal_id;

    IF is_endangered THEN
        SELECT EXISTS (
            SELECT 1 FROM permits
            WHERE adopter_id = NEW.adopter_id
            AND animal_id = NEW.animal_id
        ) INTO permit_exists;

        IF NOT permit_exists THEN
            RAISE EXCEPTION 'Permit required for endangered animal adoption';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TRIGGER trigger_check_medicine_stock
BEFORE INSERT ON medicalrecords
FOR EACH ROW
EXECUTE FUNCTION check_medicine_stock();

CREATE TRIGGER trigger_enforce_foster_capacity
BEFORE INSERT ON fosterassignments
FOR EACH ROW
EXECUTE FUNCTION enforce_foster_capacity();

CREATE TRIGGER trigger_enforce_permit
BEFORE INSERT ON adoptionapplications
FOR EACH ROW
EXECUTE FUNCTION enforce_permit_for_endangered();



CREATE VIEW view_available_animals AS
SELECT a.animal_id,
       a.name,
       s.common_name AS species,
       cs.status_name,
       a.health_status
FROM animals a
JOIN species s ON a.species_id = s.species_id
JOIN conservationstatus cs ON a.status_id = cs.status_id
WHERE a.adoption_status = 'Available';

CREATE VIEW view_financial_summary AS
SELECT transaction_type,
       COUNT(*) AS total_transactions,
       SUM(amount) AS total_amount
FROM financialledger
GROUP BY transaction_type;

CREATE VIEW view_foster_home_status AS
SELECT fh.foster_home_id,
       fh.capacity,
       COUNT(fa.assignment_id) AS current_animals
FROM fosterhomes fh
LEFT JOIN fosterassignments fa
    ON fh.foster_home_id = fa.foster_home_id
    AND fa.end_date IS NULL
GROUP BY fh.foster_home_id, fh.capacity;