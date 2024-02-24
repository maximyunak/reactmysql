import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Registration = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/auth', data).then((res) => {
      alert(res.data);
    });
    navigate('/login');
  };

  const handleInputChange = (e, name) => {
    setData({ ...data, [name]: e.target.value });
  };

  return (
    <div>
      <form className="log" onSubmit={handleSubmit}>
        <h3>Register</h3>
        <div>
          <label htmlFor="">ur username</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => handleInputChange(e, 'username')}
          />
        </div>
        <div>
          <label htmlFor="">ur password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => handleInputChange(e, 'password')}
          />
        </div>
        <button type="submit">Registration</button>
        <Link to="/login">U have an account? Log in</Link>
      </form>
    </div>
  );
};

export default Registration;
