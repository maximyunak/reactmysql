import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/auth/info/${id}`).then((res) => {
      if (res.data && res.data.username) {
        setUsername(res.data.username);
      } else {
        navigate('pagenotfound');
      }
    });

    axios.get(`http://localhost:3001/posts/info/${id}`).then((res) => {
      setPosts(res.data);
    });
  }, []);

  return (
    <div className="profile">
      <div className="profile__info">
        <h1>username: {username}</h1>
        {authState.username === username && <Link to="/changepassword">change pass</Link>}
        {posts.map((el, key) => (
          <div key={key} className="postlist__post" onClick={() => navigate(`/post/${el.id}`)}>
            <div className="postlist__post-title">{el.title}</div>
            <span className="postlist__line"></span>
            <div className="postlist__post-body">{el.postText}</div>
            <div className="postlist__post-footer">
              by {el.username} {el.Likes.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
