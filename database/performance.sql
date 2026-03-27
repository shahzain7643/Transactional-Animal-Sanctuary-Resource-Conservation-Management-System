DROP INDEX IF EXISTS idx_animals_name;

EXPLAIN ANALYZE
SELECT * FROM Animals
WHERE name = 'Animal 50';

CREATE INDEX idx_animals_name
ON Animals(name);

-- After Index
EXPLAIN ANALYZE
SELECT * FROM Animals
WHERE name = 'Animal 50';


DROP INDEX IF EXISTS idx_animals_adoption_status;

EXPLAIN ANALYZE
SELECT * FROM Animals
WHERE adoption_status = 'Available';


CREATE INDEX idx_animals_adoption_status
ON Animals(adoption_status);


EXPLAIN ANALYZE
SELECT * FROM Animals
WHERE adoption_status = 'Available';



DROP INDEX IF EXISTS idx_financialledger_transaction_type;

EXPLAIN ANALYZE
SELECT SUM(amount)
FROM FinancialLedger
WHERE transaction_type = 'Donation';


CREATE INDEX idx_financialledger_transaction_type
ON FinancialLedger(transaction_type);


EXPLAIN ANALYZE
SELECT SUM(amount)
FROM FinancialLedger
WHERE transaction_type = 'Donation';



DROP INDEX IF EXISTS idx_adoptionapplications_adopter_id;


EXPLAIN ANALYZE
SELECT *
FROM AdoptionApplications aa
JOIN Users u ON aa.adopter_id = u.user_id
WHERE aa.adopter_id = 25;

CREATE INDEX idx_adoptionapplications_adopter_id
ON AdoptionApplications(adopter_id);

EXPLAIN ANALYZE
SELECT *
FROM AdoptionApplications aa
JOIN Users u ON aa.adopter_id = u.user_id
WHERE aa.adopter_id = 25;