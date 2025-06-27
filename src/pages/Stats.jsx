import React from 'react';

function Stats() {
  const history = JSON.parse(localStorage.getItem('sessionHistory')) || [];

  return (
    <div className="container">
      <div className="card">
        <h2>📊 My Stats</h2>
        {history.length === 0 ? (
          <p>No sessions yet. Go practice!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Correct</th>
                <th>Total</th>
                <th>Accuracy</th>
                <th>Speed</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, i) => (
                <tr key={i}>
                  <td>{entry.date}</td>
                  <td>{entry.correct}</td>
                  <td>{entry.total}</td>
                  <td>{entry.accuracy}</td>
                  <td>{entry.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Stats;

