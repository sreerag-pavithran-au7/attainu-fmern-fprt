import React, { Component } from 'react';
import './App.css';
import './styles/main.scss';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Register from './containers/auth/Register';
import Login from './containers/auth/Login';
import Boards from './components/Boards/Boards';
import Board from './containers/Board/Board';

import Header from './containers/Header/Header';
import PrivateRoute from './components/common/PrivateRoute';

class App extends Component {
  render() {
    return (
      <div className={'App'}>
        <Route component={Header} />
        <Switch>
          <Route exact path={'/'} component={Login} />
          <Route exact path={'/register'} component={Register} />

          <PrivateRoute exact path={'/boards/:boardId'} component={Board} />
          <PrivateRoute path={'/boards'} component={Boards} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};
export default withRouter(connect(mapStateToProps)(App));
