import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: '',
  });

  const { setAuthState } = useContext(AuthContext);

  const handleInputChange = (e, name) => {
    setData({ ...data, [name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:3001/auth/login', data).then((res) => {
      if (res.data.error) {
        alert(res.data.error);
      } else {
        localStorage.setItem('accessToken', res.data.token);
        setAuthState({ username: res.data.username, id: res.data.id, status: true });
        navigate('/');
      }
    });
  };

  return (
    <div>
      <div>
        <form className="log" onSubmit={handleSubmit}>
          <h3>Log in</h3>
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
          <button type="submit">Log in</button>
          <Link to="/registration">Create an account</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
