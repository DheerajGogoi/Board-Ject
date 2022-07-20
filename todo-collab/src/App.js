import logo from './logo.svg';
import './App.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { login_routes, general_routes } from './routes/routes';

function App() {
  const isLoggedIn = useSelector(state => state.auth.userLoggedIn);

  return (
    <>
    <Suspense fallback={<div><LinearProgress /></div>}>
    {
      !isLoggedIn ? (
        <Router>
          <Switch>
            {
              login_routes.map(({ path, component }, index) => {
                return <Route key={index} path={path} component={component} exact />
              })
            }
            <Route path='*' exact >
              <Redirect to='/login' />
            </Route>
          </Switch>
        </Router>
      ) : (
        <Router>
          <Switch>
            {
              general_routes.map(({ path, component }, index) => {
                return <Route key={index} path={path} component={component} exact />
              })
            }
            <Route path='*' exact >
              <Redirect to='/projects' />
            </Route>
          </Switch>
        </Router>
      )
    }
    </Suspense>
    </>
  );
}

export default App;
