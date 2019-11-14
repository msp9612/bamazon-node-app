require('console.table');
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');

const queryAllAliases = 'SELECT ' +
                        'item_id AS \'Item ID\', ' +
                        'product_name AS \'Product\', ' +
                        'department_name AS \'Department\', ' +
                        'CONCAT(\'$\', price) AS \'Price\', ' +
                        'stock_quantity AS \'In Stock\' ' +
                        'FROM products';


// Display products table
function displayProducts() {
  connection.query(queryAllAliases, function(err, res) {
    if (err) throw 'An error occurred while attempting to display the products table.\n' + err;
    console.table(res);
    promptIDForPurchase(res);
  });
};

// Prompt for ID of product to be purchased
function promptIDForPurchase(products) {
  inquirer
      .prompt([
        {
          type: 'input',
          name: 'idInput',
          message: 'Enter the ID of the item you wish to purchase. [Q to quit]',
          validate: (val) => {
            return !isNaN(val) || val.toLowerCase() === 'q';
          },
        },
      ])
      .then((val) => {
        checkQuit(val.idInput);
        const idNum = parseInt(val.idInput);
        const product = findProduct(idNum, products);
        if (product) {
          promptQuantity(product);
        } else {
          console.log('Could not find an item with that ID.\n');
          displayProducts();
        }
      });
}

// Prompt for quantity
function promptQuantity(product) {
  inquirer
      .prompt([
        {
          type: 'input',
          name: 'quantityInput',
          message: 'How many? [Q to quit]',
          validate: (val) => {
            return val > 0 || val.toLowerCase() === 'q';
          },
        },
      ])
      .then((val) => {
        checkQuit(val.quantityInput);
        const quantityNum = parseInt(val.quantityInput);
        if (quantityNum <= product['In Stock']) {
          purchaseProduct(product, quantityNum);
        } else {
          console.log('Not enough in stock.\n');
          displayProducts();
        }
      });
}

// Purchase the product
function purchaseProduct(product, quantity) {
  connection.query(
      'UPDATE products ' +
      'SET stock_quantity = stock_quantity - ? ' +
      'WHERE item_id = ?',
      [quantity, product['Item ID']],
      function(err, res) {
        console.log(
            'Success!\n' +
            'You purchased: ' + product['Product'] + '\n' +
            'Quantity: ' + quantity + '\n' +
            'Total cost: ' + ('$' + (product['Price'].substring(1) * quantity).toFixed(2)) + '\n');
        displayProducts();
      },
  );
}

// Find product with chosen ID (if it exists)
function findProduct(id, products) {
  for (let i = 0; i < products.length; i++) {
    if (id === products[i]['Item ID']) {
      return products[i];
    }
  }
  return null;
}

// Check if q was entered to quit
function checkQuit(char) {
  if (char.toLowerCase() === 'q') {
    console.log('Thank you!');
    process.exit();
  }
}


// MAIN PROCESS
// ------------
// Initialize connection with database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: 'bamazon',
});
// Create connection and load data if successful
connection.connect((err) => {
  if (err) throw 'An error occurred while attempting to connect to the server.\n' + err;
  displayProducts();
});
