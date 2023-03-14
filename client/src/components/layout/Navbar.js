import { connect } from 'react-redux';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../../Actions/auth';
const Navbar = ({ Auth: { isAuthenticated, loading }, logout }) => {
  const authLinks = (
    <ul>
      <li>
        <Link onClick={logout} to='#!'>
          <i className='fas fa-sign-out-alt'></i>
          <span className='hide-sm'>Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to='#!'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );
  return (
    <div>
      <nav className='navbar bg-dark'>
        <h1>
          <a href='/'>
            <i className='fas fa-code'></i> DevConnector
          </a>
        </h1>
        {!loading && (
          <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        )}
      </nav>
    </div>
  );
};
Navbar.prototype = {
  logout: PropTypes.func.isRequired,
  Auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  Auth: state.Auth,
});
export default connect(mapStateToProps, { logout })(Navbar);
