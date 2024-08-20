import React, { useState } from 'react';
import axios from 'axios';

const TweetForm = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('http://localhost:5000/tweet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Let the browser handle the correct header
        },
      });
      alert('Tweet posted successfully!');
      setText('');
      setImage(null);
    } catch (error) {
      console.error('Error posting tweet:', error);
      alert('Failed to post tweet.');
    }
  };

  return (
    <form onSubmit={handleTweetSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening?"
      ></textarea>
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit">Tweet</button>
    </form>
  );
};

export default TweetForm;
