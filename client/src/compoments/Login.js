import React, { useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import axios from 'axios';

export default function Login({ onIdSubmit }) {
  const defaultImg =
    'http://beepeers.com/assets/images/tradeshows/default-image.jpg';
  const [avatar, setAvatar] = useState(defaultImg);
  const [imgFile, setImgFile] = useState(null);
  const [username, setUsername] = useState('');
  const inputFile = useRef(null);

  function previewImg(e) {
    const myImg = e.target.files[0];
    if (!myImg) return;
    const imgURL = myImg ? URL.createObjectURL(myImg) : defaultImg;
    setAvatar(imgURL);
    setImgFile(myImg);
  }

  function revokeObjectURL(imgURL) {
    URL.revokeObjectURL(imgURL);
  }

  function inputFileClick() {
    inputFile.current.click();
  }

  async function handleSunbmit(e) {
    e.preventDefault();
    const userId = uuidV4();
    //axios傳遞檔案需用formData
    const formData = new FormData();
    formData.append('image', imgFile);
    formData.append('id', userId);

    await axios.post('http://localhost:8080/upload', formData);

    const getAvatar = await axios.get(`http://localhost:8080/avatar`, {
      params: { id: userId },
    });

    onIdSubmit({
      username: username,
      avatar: getAvatar.data,
      id: userId,
    });
  }

  return (
    <form className="login" onSubmit={handleSunbmit}>
      <input
        className="hidden"
        ref={inputFile}
        type="file"
        accept="image/gif,image/jpeg,image/jpg,image/png"
        onChange={previewImg}
      />
      <div className="avatar gradient-border" onClick={inputFileClick}>
        <img
          src={avatar}
          alt=""
          onLoad={() => {
            revokeObjectURL(avatar);
          }}
        />
      </div>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        required
      />
    </form>
  );
}
