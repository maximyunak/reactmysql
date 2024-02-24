import React, { useEffect, useState } from 'react';

import { Link, Route, Routes, useNavigate } from 'react-router-dom';

import './app.scss';

import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import Post from './pages/Post';
import Login from './pages/Login';
import Registration from './pages/Registration';

import { AuthContext } from './helpers/AuthContext';
import axios from 'axios';
import PageNotFound from './pages/PageNotFound';
import Profile from './pages/Profile';
import ChangePass from './pages/ChangePass';

const App = () => {
  const [authState, setAuthState] = useState({ username: '', id: 0, status: false });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/auth/auth', {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then((res) => {
        if (res.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({ username: res.data.username, id: res.data.id, status: true });
        }
      });
  }, []);

  const logout = () => {
    setAuthState({ username: '', id: 0, status: false });
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="app">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div className="header">
          <div className="header__nav">
            {authState.status && (
              <>
                <Link to="/">Back to home</Link>
                <Link to="/createpost">Create a post</Link>
                <Link to={`/profile/${authState.id}`}>Profile</Link>
              </>
            )}
            {!authState.status ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            ) : (
              <button onClick={logout}>Logout</button>
            )}
          </div>
        </div>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/createpost" element={<CreatePost />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/login" element={<Login />} />
            <Route path="/changepassword" element={<ChangePass />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
