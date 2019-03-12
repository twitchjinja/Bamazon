DROP DATABASE IF EXISTS bamazon_db;


CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  product_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity  INTEGER NULL,
  PRIMARY KEY (product_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES
		('Toilet Paper', "Bathroom Products", 5.50, 500),
        ('Soap', "Bathroom Products", 3.25, 425),
        ('Pizza', "Food", 11.50, 40),
        ('salad', "Food", 7.45, 30),
        ('Golf Clubs', "Sports", 220.75, 300),
        ('BasketBall', "Sports", 36.75, 200),
        ('Tennis Ball', "Sports", 10.25, 500),
        ('Soccer Ball', "Sports", 24.95, 75),
        ('Car Engine', "Automobile", 750.95, 10),
        ('Car Tires', "Automobile", 125.75, 40);