import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import register from "./components/auth/register";
import login from "./components/auth/login";

//Redux
import { Provider } from "react-redux";
import store from "./store";
import Alert from "./components/layout/Alert";

const App = () => (
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
          </Routes>
        </section>
      </Fragment>
    </Router>
  </Provider>
);

export default App;
