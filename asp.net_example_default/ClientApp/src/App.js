import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import Chat from './components/Chat';
import Groups from './components/Groups';



export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Chat} />
        <Route path='/groups' component={Groups} />
      </Layout>
    );
  }
}
