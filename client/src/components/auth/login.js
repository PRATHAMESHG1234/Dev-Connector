import React, { Fragment, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';

import { login } from '../../Actions/auth';
import { setAlert } from '../../Actions/alert';
import PropTypes from 'prop-types';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const onSubmit = (event) => {
    event.preventDefault();

    login(email, password);
  };

  //Redirect if logged in

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }
  return (
    <Fragment>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Login to Your Account
      </p>
      <form className='form' action='create-profile.html' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={handleChange}
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Does not have an account? <Link to='/register'>Sign up</Link>
      </p>
    </Fragment>
  );
};

Login.prototype = {
  setAlert: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.Auth.isAuthenticated,
});
export default connect(mapStateToProps, { setAlert, login })(Login);
