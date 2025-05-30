export default function Home({ onStart }) {
  return (
    <div className="card">
      <h1>Fraction & Integer Algebra Trainer</h1>
      <p style={{ textAlign: 'left' }}>
        • Pick a 10-, 20-, 30-, or 60-minute session.<br/>
        • Solve equations with fractional <em>and</em> integer coefficients.<br/>
        • See accuracy & speed on public and personal leaderboards.
      </p>
      <button onClick={onStart}>Start practice →</button>
    </div>
  );
}


