const mysql = require('promise-mysql');
const conf = require('./config.js');

// The following is copy/pasted from a previous exercise for reference:

class DB {
  /**
   * Creates a connection if one does not already exist
   * @return {Promise} the connection object
 */
  async createConnection() {
    if (this.conn) return this.conn;
    this.conn = await mysql.createConnection(conf);
    return this.conn;
  }

  /**
 * Reads all items from the auctions table
 * @return {Promise}
 */
  async getAllItems() {
    return this.conn.query(
        'SELECT item_name, category, starting_bid, highest_bid FROM auctions',
    );
  }

  /**
 * Reads one item from the auctions table
 * @param {string} itemName
 * @return {Promise}
 */
  async getItemByName(itemName) {
    return this.conn.query(
        // eslint-disable-next-line max-len
        'SELECT item_name, category, starting_bid, highest_bid FROM auctions WHERE ?',
        {
          item_name: itemName,
        },
    );
  }

  /**
 * Adds an item to the auctions table
 * @param {string} name the product name
 * @param {number} startingBid the product's starting bid
 * @return {Promise}
 */
  createProduct(name, startingBid) {
    return this.conn.query(
        'INSERT INTO auctions SET ?',
        {
          item_name: name,
          starting_bid: startingBid,
        });
  }

  /**
 * Updates an item in the auctions table with a new highest bid
 * @param {string} itemName
 * @param {number} bid
 * @return {Promise}
 */
  updateItemWithBid(itemName, bid) {
    return this.conn.query(
        'UPDATE auctions SET ? WHERE ?',
        [
          {
            highest_bid: bid,
          },
          {
            item_name: itemName,
          },
        ]);
  }
}

module.exports = DB;


