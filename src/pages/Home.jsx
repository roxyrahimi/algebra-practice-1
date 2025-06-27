import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name);
      navigate('/practice');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to Algebra Practice</h1>
        <p>Please enter your name or email to begin:</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name or email"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Continue</button>
        </form>
      </div>

<p><a href="/stats">📊 View My Stats</a></p>

    </div>
  );
}

export default Home;




