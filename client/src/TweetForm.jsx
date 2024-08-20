import React, { useState } from 'react';
import axios from 'axios';

const TweetForm = () => {
  const [text, setText] = useState('');

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/tweet', { text }, {
        headers: { 'Content-Type': 'application/json' },
      });
      alert('Tweet posted successfully!');
      setText(''); // Clear the text field after a successful tweet
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
      <button type="submit">Tweet</button>
    </form>
  );
};

export default TweetForm;
