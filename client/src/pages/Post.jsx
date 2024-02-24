import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../helpers/AuthContext';

const Post = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const { authState } = useContext(AuthContext);

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    } else {
      axios.get(`http://localhost:3001/posts/byId/${id}`).then((res) => {
        setPost(res.data);
      });
      axios.get(`http://localhost:3001/comments/${id}`).then((res) => {
        setComments(res.data);
      });
    }
  }, []);

  const addComment = () => {
    if (newComment.length >= 1 && newComment.length <= 250) {
      axios
        .post(
          'http://localhost:3001/comments',
          { commentBody: newComment, PostId: id },
          {
            headers: {
              accessToken: localStorage.getItem('accessToken'),
            },
          },
        )
        .then((res) => {
          if (res.data.error) {
            alert(res.data.error);
          } else {
            const commentToAdd = { commentBody: newComment, username: res.data.username };
            setComments([...comments, commentToAdd]);
            setNewComment('');
          }
        });
    } else {
      console.log('comment >');
    }
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem('accessToken') },
      })
      .then(() => {
        setComments(comments.filter((val) => val.id !== id));
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: {
          accessToken: localStorage.getItem('accessToken'),
        },
      })
      .then(() => {
        navigate('/');
      });
  };

  const editPost = (el) => {
    if (el === 'title') {
      const newTitle = prompt('enter new title');
      axios.put(
        'http://localhost:3001/posts/title',
        { newTitle: newTitle, id: id },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      );

      setPost({ ...post, title: newTitle });
    } else {
      const newText = prompt('enter new body');
      axios.put(
        'http://localhost:3001/posts/postText',
        { newText: newText, id: id },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      );

      setPost({ ...post, postText: newText });
    }
  };

  return (
    <div className="postPage">
      <div className="postPage__post">
        <div
          className="postlist__post-title"
          onClick={() => {
            if (authState.username === post.username) {
              editPost('title');
            }
          }}
        >
          {post.title}
          {authState.username === post.username && (
            <button onClick={() => deletePost(post.id)}>delete</button>
          )}
        </div>
        <span className="postlist__line"></span>
        <div className="postlist__post-body" onClick={() => editPost('body')}>
          {post.postText}
        </div>
        <div className="postlist__post-footer">by {post.username}</div>
      </div>
      {/* <button onClick={() => navigate(`/post/${+id - 1}`)}>prev</button>
      <button onClick={() => navigate(`/post/${+id + 1}`)}>next</button> */}
      <div className="postPage__comments">
        <div className="postPage__container">
          <input
            value={newComment}
            type="text"
            placeholder="add comment"
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={addComment}>Add</button>
        </div>
        <div className="postPage__list">
          {comments.map((comment, key) => (
            <div key={key} className="postPage__comment">
              <div>{comment.username}</div>
              {comment.commentBody}
              {authState.username === comment.username && (
                <button
                  onClick={() => {
                    deleteComment(comment.id);
                  }}
                >
                  x
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
