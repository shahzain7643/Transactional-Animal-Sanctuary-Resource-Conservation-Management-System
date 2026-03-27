-- ROLES
INSERT INTO roles (role_name) VALUES
('Admin'),
('Veterinarian'),
('Adopter'),
('Volunteer');

-- USERS (15)
INSERT INTO users (full_name,email,password_hash,phone) VALUES
('Ali Khan','ali@example.com','hash','0300'),
('Sara Ahmed','sara@example.com','hash','0301'),
('Bilal Raza','bilal@example.com','hash','0302'),
('Ayesha Noor','ayesha@example.com','hash','0303'),
('Usman Tariq','usman@example.com','hash','0304'),
('Fatima Zahra','fatima@example.com','hash','0305'),
('Hamza Ali','hamza@example.com','hash','0306'),
('Noor Hassan','noor@example.com','hash','0307'),
('Omar Farooq','omar@example.com','hash','0308'),
('Zain Malik','zain@example.com','hash','0309'),
('Hina Shah','hina@example.com','hash','0310'),
('Saad Qureshi','saad@example.com','hash','0311'),
('Iqra Khan','iqra@example.com','hash','0312'),
('Danish Ali','danish@example.com','hash','0313'),
('Maryam Khan','maryam@example.com','hash','0314');

-- USER ROLES
INSERT INTO userroles VALUES
(1,1),(2,2),(3,3),(4,3),(5,4),
(6,3),(7,2),(8,3),(9,3),(10,3),
(11,4),(12,3),(13,3),(14,2),(15,3);

-- SPECIES
INSERT INTO species (common_name,scientific_name,requires_permit) VALUES
('Dog','Canis lupus familiaris',false),
('Cat','Felis catus',false),
('Parrot','Psittaciformes',true),
('Rabbit','Oryctolagus cuniculus',false),
('Turtle','Testudines',true),
('Fox','Vulpes vulpes',true);

-- CONSERVATION STATUS
INSERT INTO conservationstatus (status_name,funding_priority) VALUES
('Least Concern',false),
('Near Threatened',false),
('Vulnerable',true),
('Endangered',true);

-- ANIMALS (20)
INSERT INTO animals (name,species_id,status_id,intake_date,gender,health_status,adoption_status) VALUES
('Buddy',1,1,'2024-01-01','Male','Healthy','Available'),
('Luna',2,1,'2024-01-05','Female','Healthy','Available'),
('Max',1,2,'2024-01-10','Male','Injured','Medical'),
('Coco',3,3,'2024-01-15','Female','Recovering','Available'),
('Bella',2,1,'2024-01-20','Female','Healthy','Fostered'),
('Charlie',1,2,'2024-02-01','Male','Healthy','Available'),
('Milo',2,1,'2024-02-05','Male','Healthy','Available'),
('Ruby',4,1,'2024-02-07','Female','Healthy','Available'),
('Rocky',1,3,'2024-02-10','Male','Critical','Medical'),
('Daisy',2,1,'2024-02-12','Female','Healthy','Available'),
('Leo',1,1,'2024-02-15','Male','Healthy','Available'),
('Nala',2,1,'2024-02-18','Female','Healthy','Available'),
('Oscar',3,2,'2024-02-20','Male','Healthy','Available'),
('Lily',4,1,'2024-02-22','Female','Healthy','Available'),
('Simba',1,1,'2024-02-25','Male','Healthy','Available'),
('Zoe',2,1,'2024-02-27','Female','Healthy','Available'),
('Jack',1,2,'2024-03-01','Male','Recovering','Medical'),
('Misty',2,1,'2024-03-05','Female','Healthy','Available'),
('Toby',1,1,'2024-03-07','Male','Healthy','Available'),
('Peanut',4,1,'2024-03-10','Female','Healthy','Available');

-- MEDICINES
INSERT INTO medicines (name,description,unit,quantity_in_stock) VALUES
('Antibiotic','Infection treatment','bottle',100),
('Painkiller','Pain relief','box',200),
('Vaccine','Immunization','dose',150),
('Dewormer','Parasite control','tablet',300),
('Saline','Fluid therapy','bag',80),
('Bandage','Wound care','roll',120);

-- INVENTORY TRANSACTIONS (10)
INSERT INTO inventorytransactions (medicine_id,transaction_type,quantity) VALUES
(1,'IN',50),(2,'OUT',10),(3,'IN',40),(4,'OUT',20),(5,'IN',30),
(6,'OUT',15),(1,'OUT',5),(2,'IN',60),(3,'OUT',10),(4,'IN',25);

-- MEDICAL RECORDS (10)
INSERT INTO medicalrecords (animal_id,staff_id,treatment_description,medicine_id,quantity_used) VALUES
(3,2,'Wound treatment',6,2),
(9,7,'Critical care',1,3),
(17,2,'Recovery monitoring',5,1),
(4,2,'Routine check',3,1),
(1,7,'Vaccination',3,1),
(2,7,'Checkup',2,1),
(5,2,'Minor injury',6,1),
(8,2,'Deworming',4,2),
(10,7,'Vaccination',3,1),
(11,7,'Checkup',2,1);

-- FOSTER HOMES
INSERT INTO fosterhomes (user_id,address,capacity,approved) VALUES
(5,'Lahore DHA',3,true),
(11,'Johar Town',2,true),
(8,'Model Town',4,true),
(3,'Gulberg',2,true),
(6,'Cantt',3,false);

-- FOSTER ASSIGNMENTS
INSERT INTO fosterassignments (animal_id,foster_home_id,start_date) VALUES
(5,1,'2024-03-01'),
(8,2,'2024-03-02'),
(14,3,'2024-03-03'),
(18,4,'2024-03-04'),
(20,1,'2024-03-05');

-- DONATIONS (10)
INSERT INTO donations (donor_id,amount,payment_method,reference_note) VALUES
(3,5000,'Card','General donation'),
(4,2500,'Cash','Support'),
(6,10000,'Bank','Equipment'),
(8,1500,'Cash','Food'),
(9,3000,'Card','Care'),
(10,7000,'Bank','Medical'),
(12,2000,'Cash','Help'),
(13,3500,'Card','Donation'),
(15,4000,'Bank','Support'),
(1,6000,'Card','Contribution');

-- FINANCIAL LEDGER (10)
INSERT INTO financialledger (transaction_type,reference_id,amount,description) VALUES
('Donation',1,5000,'Donation entry'),
('Donation',2,2500,'Donation entry'),
('Expense',NULL,2000,'Medicine purchase'),
('Expense',NULL,1500,'Food'),
('Donation',3,10000,'Donation entry'),
('AdoptionFee',NULL,3000,'Adoption income'),
('Expense',NULL,1000,'Supplies'),
('Donation',4,1500,'Donation entry'),
('Expense',NULL,2500,'Maintenance'),
('Donation',5,3000,'Donation entry');

-- ADOPTION APPLICATIONS (10)
INSERT INTO adoptionapplications (animal_id,adopter_id,admin_id,status) VALUES
(1,3,1,'Pending'),
(2,4,1,'Approved'),
(6,6,1,'Rejected'),
(7,8,1,'Pending'),
(10,9,1,'Approved'),
(11,10,1,'Pending'),
(12,12,1,'Approved'),
(13,13,1,'Pending'),
(15,15,1,'Approved'),
(16,3,1,'Pending');

-- ADOPTIONS (5)
INSERT INTO adoptions (application_id,adoption_fee,payment_status) VALUES
(2,3000,'Paid'),
(5,2500,'Paid'),
(7,2000,'Pending'),
(9,3500,'Paid'),
(3,1500,'Pending');

-- PERMITS (5)
INSERT INTO permits (adopter_id,animal_id,issued_by,expiry_date) VALUES
(3,4,1,'2026-01-01'),
(4,13,1,'2026-01-01'),
(6,3,1,'2026-01-01'),
(8,5,1,'2026-01-01'),
(9,9,1,'2026-01-01');