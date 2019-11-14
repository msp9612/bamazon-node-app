DELETE FROM products;

ALTER TABLE products AUTO_INCREMENT = 1;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
  ('Tablet', 'Electronics', 119.99, 13),
  ('Earbud Headphones', 'Electronics', 12.99, 15),
  ('Beard Kit', 'Beauty', 24.90, 11),
  ('Makeup Sponge Set', 'Beauty', 8.49, 15),
  ('Family Board Game', 'Toys & Games', 22.85, 2),
  ('Dinosaur Toy', 'Toys & Games', 42.49, 8),
  ('Dumbbell Set', 'Sports & Outdoors', 279.99, 20),
  ('Ski & Snowboard Gloves', 'Sports & Outdoors', 14.95, 4),
  ('Measuring Spoons Set', 'Kitchen', 10.17, 20),
  ('Toaster Oven', 'Kitchen', 55.24, 2);

SELECT item_id, product_name, department_name, CONCAT('$', price) AS 'price', stock_quantity FROM products;