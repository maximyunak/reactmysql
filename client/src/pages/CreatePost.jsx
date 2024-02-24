import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

const CreatePost = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    title: '',
    postText: '',
  });
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    }
  }, []);

  const handleInputChange = (e, name) => {
    setData({ ...data, [name]: e.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:3001/posts', data, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then((res) => {
        navigate('/');
      });
  };

  return (
    <div className="createPostPage">
      <form className="formContainer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={data.title}
          placeholder="enter a post title"
          onChange={(e) => handleInputChange(e, 'title')}
        />
        <input
          type="text"
          value={data.postText}
          placeholder="enter a post text"
          onChange={(e) => handleInputChange(e, 'postText')}
        />
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default CreatePost;
