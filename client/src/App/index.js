import React, { Component } from 'react';
import AppLayout from './AppLayout';
import AppBar from './AppBar';
import {AppProvider} from './AppProvider';
import Settings from '../Settings';
import Dashboard from '../Dashboard';
import Content from '../Shared/Content';
import Landing from '../Landing';
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
     
        <AppLayout>
          <AppProvider>
            <AppBar/>
            <Content>
                <Settings />
                <Dashboard />
                <Landing />
            </Content>
          </AppProvider>
        </AppLayout>
      
    );
  }
}
export default App;
