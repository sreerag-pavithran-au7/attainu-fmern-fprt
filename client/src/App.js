import React from 'react';
import {Provider} from 'react-redux'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import store from "./store"
import Header from './components/Header/Header'
import Login from './components/User/Login'
import Register from './components/User/Register' 
import './App.css';
import './styles/main.scss'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className={'App'}>
          <Route component={Header} />
          <Switch>
            <Route exact path={'/'} component={Login} />
            <Route exact path={'/register'} component={Register} />

            {/* <PrivateRoute exact path={'/boards/:boardId'} component={Board} />
            <PrivateRoute path={'/boards'} component={Boards} /> */} */}
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
    
  );
}

export default App;
