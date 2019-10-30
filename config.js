require('dotenv').config();

module.exports = {
  host: 'localhost',
  port: 3306,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: 'bamazon',
};
