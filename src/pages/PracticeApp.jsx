import React, { useState, useEffect } from 'react';

/* ================================================================
   helpers: fractions, generator, storage
   ================================================================ */

// int rand
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// gcd + reduced fraction
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const makeFrac = (n, d) => {
  if (d === 0) throw new Error("Zero denominator");
  const g = gcd(n, d);
  n = n / g;
  d = d / g;
  // normalize sign onto numerator
  if (d < 0) {
    n = -n;
    d = -d;
  }
  // if denominator is now 1, represent as integer
  if (d === 1) return { n, d: 1 };
  return { n, d };
};

// random non-zero fraction  ±1…maxNum over 1…maxDen
const randFrac = (maxNum = 5, maxDen = 6) => {
  const d = randInt(1, maxDen);
  let   n = randInt(-maxNum, maxNum);
  if (n === 0) n = 1;
  return makeFrac(n, d);
};

const fToStr = f => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);

const fAdd = (a, b) => makeFrac(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a, b) => makeFrac(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a, b) => makeFrac(a.n * b.n,               a.d * b.d);
const fDiv = (a, b) => makeFrac(a.n * b.d,               a.d * b.n);

// generator: at least one coefficient or constant is a fraction
const genProblem = () => {
  const ints  = () => makeFrac(randInt(-9, 9), 1);
  const fracs = () => randFrac(5, 6);

  const parts = [ints(), ints(), fracs(), fracs()];
  // shuffle
  for (let i = parts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [parts[i], parts[j]] = [parts[j], parts[i]];
  }
  const [a, b, c, d] = parts;

  // avoid a == c (zero denominator)
  if (a.n * c.d === c.n * a.d) return genProblem();

  return { a, b, c, d };
};

const solveX = ({ a, b, c, d }) => fDiv(fSub(d, b), fSub(a, c));

/* ================================================================
   Problem component
   ================================================================ */
function Problem({ onCorrect, onWrong }) {
  const [prob, setProb] = useState(genProblem());
  const [guess, setGuess] = useState('');
  const [hint,  setHint]  = useState('');

  const next = () => {
    setProb(genProblem());
    setGuess('');
    setHint('');
  };

  const check = () => {
    const val = guess.trim();
    const correctStr = fToStr(solveX(prob));

    if (val === correctStr) {
      onCorrect();
      next();
    } else {
      onWrong();
      setHint('Incorrect – try again (remember to simplify).');
    }
  };

  const { a, b, c, d } = prob;
  const eq = `${fToStr(a)}x ${b.n >= 0 ? '+' : ''} ${fToStr(b)} = ` +
             `${fToStr(c)}x ${d.n >= 0 ? '+' : ''} ${fToStr(d)}`;

  return (
    <div style={{ marginTop: '1rem' }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{eq}</div>
      <input
        value={guess}
        onChange={e => setGuess(e.target.value)}
        placeholder="x = ?"
        style={{ marginRight: '0.5rem' }}
      />
      <button onClick={check}>✓</button>
      {hint && <div style={{ color: 'crimson', marginTop: '0.5rem' }}>{hint}</div>}
    </div>
  );
}

/* ================================================================
   PracticeApp  (page routed at /practice)
   ================================================================ */
export default function PracticeApp() {
  const [student,    setStudent]    = useState('');
  const [nameInput,  setNameInput]  = useState('');
  const [mins,       setMins]       = useState(null);
  const [secsLeft,   setSecsLeft]   = useState(0);
  const [correct,    setCorrect]    = useState(0);
  const [total,      setTotal]      = useState(0);
  const [stats,      setStats]      = useState({});

  /* ---------------- timers & effects ---------------- */
  useEffect(() => {
    if (secsLeft <= 0) return;
    const t = setTimeout(() => setSecsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secsLeft]);

  useEffect(() => {
    if (!student) return;
    const stored = localStorage.getItem(student);
    setStats(stored ? JSON.parse(stored) : {});
  }, [student]);

  /* ---------------- helpers ---------------- */
  const startSession = m => {
    setMins(m);
    setSecsLeft(m * 60);
    setCorrect(0);
    setTotal(0);
  };

  const finish = () => {
    const attempt = {
      date: new Date().toLocaleString(),
      accuracy: total ? ((correct / total) * 100).toFixed(1) : '0',
    };
    const updated = { ...stats, [Date.now()]: attempt };
    setStats(updated);
    localStorage.setItem(student, JSON.stringify(updated));
    setMins(null);
  };

  /* ---------------- render ---------------- */
  if (!student) {
    const submit = () => {
      if (nameInput.trim()) setStudent(nameInput.trim());
    };

    return (
      <div style={{ marginTop: '3rem' }}>
        <h2>Enter your name or e-mail</h2>
        <input
          style={{ fontSize: '1rem' }}
          value={nameInput}
          onChange={e => setNameInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button style={{ marginLeft: '0.5rem' }} onClick={submit}>
          Continue
        </button>
      </div>
    );
  }

  if (!mins) {
    return (
      <div style={{ marginTop: '3rem' }}>
        <h2>Hello {student}! Choose session length:</h2>
        {[10, 20, 30, 60].map(m => (
          <button key={m} onClick={() => startSession(m)} style={{ margin: 4 }}>
            {m} min
          </button>
        ))}

        {Object.keys(stats).length > 0 && (
          <>
            <h3 style={{ marginTop: '2rem' }}>Previous attempts</h3>
            <ul>
              {Object.values(stats).map((s, i) => (
                <li key={i}>{s.date} — {s.accuracy}%</li>
              ))}
            </ul>
          </>
        )}
      </div>
    );
  }

  if (secsLeft === 0) {
    return (
      <div style={{ marginTop: '3rem' }}>
        <h2>Time’s up!</h2>
        <p>Accuracy: {total ? ((correct / total) * 100).toFixed(1) : 0}%</p>
        <button onClick={finish}>Save & Back to menu</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>
        Time&nbsp;left: {Math.floor(secsLeft / 60)}
        :{`${secsLeft % 60}`.padStart(2, '0')}
      </h2>
      <p>Correct {correct} / {total}</p>

      <Problem
        onCorrect={() => {
          setCorrect(c => c + 1);
          setTotal(t => t + 1);
        }}
        onWrong={() => setTotal(t => t + 1)}
      />
    </div>
  );
}
