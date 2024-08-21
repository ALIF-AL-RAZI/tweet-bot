import React, { useState } from 'react';
import axios from 'axios';

const TweetForm = () => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // State to hold selected images

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('text', text);

    // Append each image to formData with the key 'images'
    images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await axios.post('http://localhost:5000/tweet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Tweet posted successfully!');
      setText('');
      setImages([]);
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
        multiple
        onChange={(e) => setImages([...e.target.files])} // Handle multiple image selections
      />
      <button type="submit">Tweet</button>
    </form>
  );
};

export default TweetForm;
