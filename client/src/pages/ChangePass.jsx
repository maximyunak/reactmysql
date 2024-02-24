import axios from 'axios';
import React, { useState } from 'react';

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onEdit = () => {
    axios
      .put(
        'http://localhost:3001/auth/changepassword',
        { oldPassword, newPassword },
        { headers: { accessToken: localStorage.getItem('accessToken') } },
      )
      .then((res) => {
        if (res.data.error) {
          alert(res.data.error);
        }
      });
  };

  return (
    <div>
      <h1>change ur password</h1>
      <input
        type="text"
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder="Old password"
      />
      <input
        type="text"
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
      />
      <button onClick={onEdit}>Save changes</button>
    </div>
  );
};

export default ChangePass;
