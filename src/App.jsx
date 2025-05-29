import { useState, useEffect } from "react";

/* ======================================================
   helpers: fractions, generator, storage
   ====================================================== */
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const simplify = (n, d) => {
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d < 0) {
    n = -n;
    d = -d;
  }
  return [n, d];
};
const isSimplified = (str) => {
  if (!str.includes("/")) return true;
  const [n, d] = str.split("/").map(Number);
  return gcd(n, d) === 1;
};
const parseInput = (str) => {
  if (str.includes("/")) {
    const [n, d] = str.split("/").map(Number);
    return n / d;
  }
  return Number(str);
};

// random ax + b = cx + d  with a≠c
const randInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const genProblem = () => {
  let a = randInt(-5, 5);
  let c = randInt(-5, 5);
  while (a === 0) a = randInt(-5, 5);
  while (c === 0 || c === a) c = randInt(-5, 5);
  const b = randInt(-9, 9);
  const d = randInt(-9, 9);
  const ans = (d - b) / (a - c);
  return {
    text: `${a}x ${b >= 0 ? "+ " : "- "}${Math.abs(b)} = ${c}x ${
      d >= 0 ? "+ " : "- "
    }${Math.abs(d)}`,
    answer: Number(ans.toFixed(4)),
  };
};

// localStorage helpers
const keyFor = (student) => `stats_${student}`;
const today = () => new Date().toISOString().slice(0, 10);

/* ======================================================
   Problem component
   ====================================================== */
function Problem({ onCorrect, onWrong }) {
  const [prob, setProb] = useState(genProblem());
  const [guess, setGuess] = useState("");
  const [hint, setHint] = useState("");

  const check = () => {
    const val = guess.trim();
    // simplified check
    if (!isSimplified(val)) {
      setHint("Please simplify your fraction.");
      onWrong();
      return;
    }
    const num = parseInput(val);
    if (isNaN(num) || Math.abs(num - prob.answer) > 1e-3) {
      setHint("Try again 🙂");
      onWrong();
      return;
    }
    onCorrect();
    setHint("");
    setProb(genProblem());
    setGuess("");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 22 }}>{prob.text}</div>
      <input
        placeholder="answer"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        style={{ marginRight: 8 }}
      />
      <button onClick={check}>✓</button>
      {hint && <div style={{ color: "red", marginTop: 6 }}>{hint}</div>}
    </div>
  );
}

/* ======================================================
   Leaderboard component
   ====================================================== */
function Leaderboard({ data }) {
  const rows = Object.entries(data)
    .sort(([d1], [d2]) => (d1 < d2 ? 1 : -1))
    .map(([date, { correct, total, minutes }]) => (
      <tr key={date}>
        <td>{date}</td>
        <td>
          {correct}/{total} = {total ? Math.round((correct / total) * 100) : 0}%
        </td>
        <td>{minutes}</td>
      </tr>
    ));
  if (!rows.length) return null;
  return (
    <table style={{ marginTop: 20, borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Accuracy</th>
          <th>Minutes</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

/* ======================================================
   Main App
   ====================================================== */
export default function App() {
  const [student, setStudent] = useState(
    localStorage.getItem("student") || ""
  );
  const [nameInput, setNameInput] = useState("");
  const [targetMin, setTargetMin] = useState(null);
  const [secsLeft, setSecsLeft] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(() => {
    if (!student) return {};
    return JSON.parse(localStorage.getItem(keyFor(student)) || "{}");
  });

  // countdown
  useEffect(() => {
    if (!secsLeft) return;
    const id = setInterval(() => setSecsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [secsLeft]);

  // save at end
  useEffect(() => {
    if (secsLeft === 0 && targetMin && student) {
      const newStats = {
        ...stats,
        [today()]: { correct, total, minutes: targetMin },
      };
      setStats(newStats);
      localStorage.setItem(keyFor(student), JSON.stringify(newStats));
    }
  }, [secsLeft, targetMin, correct, total, student]);

  /* ---------- UI states ---------- */

  // 0. ask for student name
  if (!student) {
    return (
      <div style={{ margin: 40 }}>
        <h2>Enter your name</h2>
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <button
          onClick={() => {
            if (!nameInput.trim()) return;
            const n = nameInput.trim();
            localStorage.setItem("student", n);
            setStudent(n);
            setStats(JSON.parse(localStorage.getItem(keyFor(n)) || "{}"));
          }}
        >
          Start
        </button>
      </div>
    );
  }

  // 1. pick session length
  if (!targetMin)
    return (
      <div style={{ margin: 40 }}>
        <h2>Hello, {student}!</h2>
        <p>Select session length:</p>
        {[10, 20, 30, 60].map((m) => (
          <button
            key={m}
            onClick={() => {
              setTargetMin(m);
              setSecsLeft(m * 60);
            }}
            style={{ margin: 8 }}
          >
            {m} min
          </button>
        ))}
        <Leaderboard data={stats} />
      </div>
    );

  // 2. session ended
  if (secsLeft === 0)
    return (
      <div style={{ margin: 40 }}>
        <h2>Time’s up!</h2>
        <p>
          {correct} / {total} correct (
          {total ? Math.round((correct / total) * 100) : 0}%)
        </p>
        <button
          onClick={() => {
            setTargetMin(null);
            setCorrect(0);
            setTotal(0);
          }}
        >
          Start another
        </button>
        <Leaderboard data={stats} />
      </div>
    );

  // 3. active session
  return (
    <div style={{ margin: 40 }}>
      <h2>
        {Math.floor(secsLeft / 60)}:
        {String(secsLeft % 60).padStart(2, "0")} left
      </h2>
      <p>
        Correct {correct} / {total}
      </p>
      <Problem
        onCorrect={() => {
          setCorrect((c) => c + 1);
          setTotal((t) => t + 1);
        }}
        onWrong={() => setTotal((t) => t + 1)}
      />
      <div style={{ marginTop: 30 }}>
        _ / 30 mins completed today (counts when timer finishes)
      </div>
    </div>
  );
}

