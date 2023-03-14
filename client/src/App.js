import { Fragment, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import register from './components/auth/register';
import login from './components/auth/login';

//Redux
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import { loadUser } from './Actions/auth';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Routes>
            <Route exact path='/' Component={Landing} />
          </Routes>
          <section className='container'>
            <Alert />
            <Routes>
              <Route exact path='/register' Component={register}></Route>
              <Route exact path='/login' Component={login}></Route>
              <Route exact path='/dashboard' Component={Dashboard}></Route>
            </Routes>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
