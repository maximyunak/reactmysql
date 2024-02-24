import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthContext';

const Home = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('accessToken')) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/posts', {
          headers: { accessToken: localStorage.getItem('accessToken') },
        })
        .then((res) => {
          setListOfPosts(res.data.listOfPosts);
          setLikedPosts(res.data.likedPosts.map((el) => el.PostId));
        });
    }
  }, []);

  const likeAPost = (PostId) => {
    axios
      .post(
        'http://localhost:3001/likes',
        { PostId: PostId },
        { headers: { accessToken: localStorage.getItem('accessToken') } },
      )
      .then((res) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === PostId) {
              if (res.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          }),
        );
        if (likedPosts.includes(PostId)) {
          setLikedPosts(likedPosts.filter((id) => id != PostId));
        } else {
          setLikedPosts([...likedPosts, PostId]);
          console.log(likedPosts);
        }
      });
  };
  const dislikeAPost = (PostId) => {
    axios
      .post(
        'http://localhost:3001/dislikes',
        { PostId: PostId },
        { headers: { accessToken: localStorage.getItem('accessToken') } },
      )
      .then((res) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === PostId) {
              if (res.data.disliked) {
                return { ...post, Dislikes: [...post.Dislikes, 0] };
              } else {
                const dislikesArray = post.Dislikes;
                dislikesArray.pop();
                return { ...post, Dislikes: dislikesArray };
              }
            } else {
              return post;
            }
          }),
        );
      });
  };

  return (
    <div className="postlist">
      {listOfPosts.map((el, key) => (
        <div key={key} className="postlist__post">
          <div className="postlist__post-title">{el.title}</div>
          <span className="postlist__line"></span>
          <div className="postlist__post-body" onClick={() => navigate(`/post/${el.id}`)}>
            {el.postText}
          </div>
          <div className="postlist__post-footer">
            <div className="postlist__user">
              <Link to={`/profile/${el.UserId}`}>by {el.username}</Link>
            </div>
            <div className="postlist__post-footer-icons">
              <div>
                <svg
                  className={likedPosts.includes(el.id) ? 'liked' : 'unliked'}
                  onClick={() => likeAPost(el.id)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path
                    d="M695.385-166.154H303.077v-430.154l246.462-243.385 15.846 15.231q5.346 5.962 8.827 14.033t3.481 14.484v5.637l-40.308 194h274.923q23.731 0 42.635 18.904 18.903 18.904 18.903 42.635v47.938q0 5.523-1.057 11.927-1.058 6.404-2.809 11.43L761.954-208.977q-7.791 18.645-27.142 30.734-19.35 12.089-39.427 12.089ZM266.154-596.308v430.154H126.769v-430.154h139.385Z"
                    fill="white"
                  />
                </svg>
                <span>{el.Likes.length}</span>
              </div>
              <div>
                <svg
                  onClick={() => dislikeAPost(el.id)}
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 -960 960 960"
                  width="24"
                >
                  <path
                    d="M265.231-759.693h392.307v430.155L411.077-86.154l-15.847-15.231q-5.346-5.961-8.827-14.032-3.48-8.071-3.48-14.484v-5.638l40.307-193.999H148.308q-23.731 0-42.635-18.904-18.904-18.904-18.904-42.635v-47.938q0-5.524 1.058-11.928 1.057-6.403 2.808-11.429L198.662-716.87q7.79-18.644 27.141-30.733 19.351-12.09 39.428-12.09Zm429.231 430.155v-430.155h139.384v430.155H694.462Z"
                    fill="white"
                  />
                </svg>
                <span>{el.Dislikes.length}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
