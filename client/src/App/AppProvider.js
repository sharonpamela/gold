import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import API from "../utils/API";
const axios = require("axios");

const cc = require('cryptocompare');

export const AppContext = React.createContext();

const MAX_FAVORITES = 10; // max num of fav tiles displayed
const TIME_UNITS = 10; // data pts for the graph

export class AppProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // page: 'dashboard',
      page: 'landing',
      loggedOut: this.isLoggedOut,
      favorites: ['BTC', 'ETH', 'XMR', 'DOGE'],
      timeInterval: 'months',
      ...this.savedSettings(), // when called will spread results over prev props
      setPage: this.setPage, // this determines which page content to display (landing / settings / dash)
      addCoin: this.addCoin,
      removeCoin: this.removeCoin,
      isInFavorites: this.isInFavorites,
      confirmFavorites: this.confirmFavorites,
      setCurrentFavorite: this.setCurrentFavorite,
      setFilteredCoins: this.setFilteredCoins,
      changeChartSelect: this.changeChartSelect,
      buyButton: this.buyButton,
      sellButton: this.sellButton
    }
  }

  componentDidMount = () => {
    this.fetchCoins();
    this.fetchPrices();
    this.fetchHistorical();
  }

  fetchCoins = async () => {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList });
  }

  fetchPrices = async () => {
    if (this.state.firstVisit) return;
    let prices = await this.prices();
    this.setState({ prices });
  }

  isLoggedOut = async () => {
    // if this route returns false, there is no user logged in
    // true means there is a user and null means it's inbetween
    try {
        const res = await axios.get('/api/current_user');
        // this.setState({ prices });
        console.log(res);
    } catch (e) {
        console.log("fetching user logged in status", e);
    }
  }
  fetchHistorical = async () => {
    if (this.state.firstVisit) return;
    let results = await this.historical();
    let historical = [
      {
        name: this.state.currentFavorite,
        data: results.map((ticker, index) => [
          moment().subtract({ [this.state.timeInterval]: TIME_UNITS - index }).valueOf(),
          ticker.USD
        ])
      }
    ]
    this.setState({ historical });
  }

  prices = async () => {
    let returnData = [];
    for (let i = 0; i < this.state.favorites.length; i++) {
      try {
        let priceData = await cc.priceFull(this.state.favorites[i], 'USD');
        returnData.push(priceData);
      } catch (e) {
        console.warn('Fetch price error: ', e);
      }
    }
    return returnData;
  }

  historical = () => {
    let promises = [];
    for (let units = TIME_UNITS; units > 0; units--) {
      promises.push(
        cc.priceHistorical(
          this.state.currentFavorite,
          ['USD'],
          moment()
            .subtract({ [this.state.timeInterval]: units })
            .toDate()
        )
      )
    }
    return Promise.all(promises);
  }

  addCoin = async key => {
    let favorites = [...this.state.favorites];
    if (favorites.length < MAX_FAVORITES) {
      favorites.push(key);
      // update the curr state 
      this.setState({ favorites });
      // update db with curr state
      try {
        console.log("saving user's new favorites")
        await API.saveUser({
          user_id: 1,
          favorites: this.state.favorites
        });
      } catch (err) {
        console.log("Saving Favorites into DB: ", err)
      }
    }
  }

  removeCoin = key => {
    let favorites = [...this.state.favorites];
    this.setState({ favorites: _.pull(favorites, key) })
  }

  isInFavorites = key => _.includes(this.state.favorites, key)

  confirmFavorites = () => {
    let currentFavorite = this.state.favorites[0];
    this.setState({
      firstVisit: false,
      page: 'dashboard',
      currentFavorite,
      prices: null,
      historical: null
    }, () => {
      this.fetchPrices();
      this.fetchHistorical();
    });
    localStorage.setItem('cryptoDash', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
    }));
  }

  fetchBalance = () => {
    API.fetchBalance()
   // .then(console.log(this.setState({balance: res.data})))
    .catch(err => console.log(err));
  }

  

  buyButton =  (currentFavorite) => {
    console.log("buy button hit");
    //this.fetchBalance();
    // console.log(this.state.currentFavorite);

    this.state.prices.forEach( async price => {
      if (price[this.state.currentFavorite]) {
        console.log(price[this.state.currentFavorite].USD.PRICE);
        await API.buyButton({
          user_id: 33,
          price: price[this.state.currentFavorite].USD.PRICE,
          coin: this.state.currentFavorite
        })
      }
    })
  };



sellButton = (currentFavorite) => {
  console.log("sell button hit");
  this.state.prices.forEach(price => {
    if (price[this.state.currentFavorite])
      console.log(price[this.state.currentFavorite].USD.PRICE);
  })
  // console.log(this.state.historical);

}

setCurrentFavorite = (sym) => {
  this.setState({
    currentFavorite: sym,
    historical: null
  }, this.fetchHistorical);

  localStorage.setItem('cryptoDash', JSON.stringify({
    ...JSON.parse(localStorage.getItem('cryptoDash')),
    currentFavorite: sym
  }))
}

savedSettings() {
  let cryptoDashData = JSON.parse(localStorage.getItem('cryptoDash'));
  if (!cryptoDashData) {
    return { page: 'settings', firstVisit: true }
  }
  let { favorites, currentFavorite } = cryptoDashData;
  return { favorites, currentFavorite };
}

setPage = page => this.setState({ page })

setFilteredCoins = (filteredCoins) => this.setState({ filteredCoins })

changeChartSelect = (value) => {
  this.setState({ timeInterval: value, historical: null }, this.fetchHistorical);
}

render() {
  return (
    // this means the state defined in this app is accessible 
    // via any component as long as it is wrapped in AppContext.consumer tags
    <AppContext.Provider value={this.state}>
      {this.props.children}
    </AppContext.Provider>
  )
}

}
