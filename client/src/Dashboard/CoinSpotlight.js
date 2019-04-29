import React from 'react';
import styled from 'styled-components';
import { Tile } from "../Shared/Tile";
import { AppContext } from "../App/AppProvider";
import CoinImage from '../Shared/CoinImage';
import Buybutton from './buybutton';
import Sellbutton from './sellbutton';

const SpotlightName = styled.h2`
  text-align: center; 
`

export default function () {
  return (
    <AppContext.Consumer>
      {({ currentFavorite, coinList }) =>
        <Tile>
          <SpotlightName> {coinList[currentFavorite].CoinName} </SpotlightName>
          <CoinImage spotlight coin={coinList[currentFavorite]} />
          <Buybutton/>
          <Sellbutton/>
        </Tile>
      }
    </AppContext.Consumer>
  )
}
