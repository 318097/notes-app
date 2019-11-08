import React from 'react';
import { connect } from 'react-redux';

import './App.scss';

import Header from './components/Header';
import Notes from './components/Notes';

const App = () => (
  <div>
    <Header />
    <Notes />
  </div>
);

const mapStateToProps = state => ({ notes: state.notes });

export default connect(mapStateToProps)(App);
