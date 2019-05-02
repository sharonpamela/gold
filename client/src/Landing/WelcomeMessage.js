import React from 'react';
import {AppContext} from "../App/AppProvider";

export default function ({loggedOut}) {
  return (
    <AppContext.Consumer>
      {({loggedOut}) =>
        loggedOut ?
        <h1>Welcome to Gold!</h1> : 
        null
      }
    </AppContext.Consumer>
  );
};
