const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersSchema = new Schema({
  favorites: { type: String, required: true }
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;


// page: 'dashboard',
// favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
// timeInterval: 'months',
// ...this.savedSettings(),// when called will spread results over prev props
// setPage: this.setPage, // this determines which page content to display (settings or dash)
// addCoin: this.addCoin,
// removeCoin: this.removeCoin,
// isInFavorites: this.isInFavorites,
// confirmFavorites: this.confirmFavorites,
// setCurrentFavorite: this.setCurrentFavorite,
// setFilteredCoins: this.setFilteredCoins,
// changeChartSelect: this.changeChartSelect