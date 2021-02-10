CREATE SCHEMA IF NOT EXISTS `desafio-dev-api-rest`;

USE `desafio-dev-api-rest`;

CREATE TABLE IF NOT EXISTS client
(
	id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(200) NOT NULL,
	cpf VARCHAR(11) NOT NULL,
	birthday DATETIME NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	deleted_at DATETIME(6) NULL,
	CONSTRAINT uq_client_cpf UNIQUE (cpf)
);

CREATE TABLE IF NOT EXISTS account
(
	id INT AUTO_INCREMENT PRIMARY KEY,
	type INT NOT NULL,
	balance DECIMAL(13,2) DEFAULT 0.00 NOT NULL,
	daily_withdrawal_limit DECIMAL(13,2) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	blocked_at DATETIME NULL,
	deleted_at DATETIME(6) NULL,
	client_id INT NULL,
	CONSTRAINT uq_account_client_id UNIQUE (client_id),
	CONSTRAINT fk_account_client_client_id FOREIGN KEY (client_id) REFERENCES client (id)
);

CREATE TABLE IF NOT EXISTS transaction
(
	id INT AUTO_INCREMENT PRIMARY KEY,
	value DECIMAL(13,2) NOT NULL,
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
	account_id INT NULL,
	CONSTRAINT fk_transaction_account_account_id FOREIGN KEY (account_id) REFERENCES account (id)
);
