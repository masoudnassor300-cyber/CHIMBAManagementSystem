CREATE DATABASE IF NOT EXISTS chimba_invoicing
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE chimba_invoicing;

/* ===============================
   CLIENTS
================================ */
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    email VARCHAR(255),
    tin VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* ===============================
   FILES
================================ */
CREATE TABLE files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_id VARCHAR(50) NOT NULL UNIQUE,
    job_number VARCHAR(50),
    client_id INT NOT NULL,
    supplier_name VARCHAR(255),
    awb_bl VARCHAR(100),
    reference VARCHAR(100),
    description TEXT,
    vessel VARCHAR(100),
    place_of_loading VARCHAR(100),
    file_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

/* ===============================
   DOCUMENTS
================================ */
CREATE TABLE documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_number VARCHAR(100) NOT NULL UNIQUE,
    file_id INT NOT NULL,
    client_id INT NOT NULL,
    supplier_name VARCHAR(255),
    document_type ENUM('invoice','debit_note') NOT NULL,
    transport_type ENUM('sea','air','road') DEFAULT NULL,
    subtotal DECIMAL(15,2) DEFAULT 0.00,
    vat DECIMAL(15,2) DEFAULT 0.00,
    total DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES files(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

/* ===============================
   DOCUMENT ITEMS
================================ */
CREATE TABLE document_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    qty DECIMAL(10,2) DEFAULT 0,
    unit_price DECIMAL(15,2) DEFAULT 0.00,
    line_total DECIMAL(15,2) DEFAULT 0.00,
    FOREIGN KEY (document_id) REFERENCES documents(id)
);
