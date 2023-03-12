import { Fragment } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import register from "./components/auth/register";
import login from "./components/auth/login";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path='/' Component={Landing} />
      </Routes>
      <section className='container'>
        <Routes>
          <Route exact path='/register' Component={register}></Route>
          <Route exact path='/login' Component={login}></Route>
        </Routes>
      </section>
    </Fragment>
  </Router>
);

export default App;
