import React, { useState, useEffect } from 'react';

function generateQuestion() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const c = Math.floor(Math.random() * 9) + 1;
  const d = Math.floor(Math.random() * 20) - 10;

  const correctAnswer = (d - b / c) / -a;
  const equation = `-${a}x + 1/${c} = -${b}x + ${d}`;
  return { equation, answer: correctAnswer };
}

function PracticeApp() {
  const name = localStorage.getItem('userName') || 'friend';

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionLength, setSessionLength] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [question, setQuestion] = useState(generateQuestion());
  const [inputValue, setInputValue] = useState('');
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (sessionStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sessionStarted, timeLeft]);

  const startSession = (minutes) => {
    setSessionLength(minutes * 60);
    setTimeLeft(minutes * 60);
    setSessionStarted(true);
    setCorrect(0);
    setTotal(0);
    setQuestion(generateQuestion());
  };

  const handleCheck = () => {
    if (!inputValue) return;
    const userAnswer = parseFloat(inputValue);
    const isCorrect = Math.abs(userAnswer - question.answer) < 0.1;
    if (isCorrect) setCorrect((c) => c + 1);
    setTotal((t) => t + 1);
    setInputValue('');
    setQuestion(generateQuestion());
  };

  return (
    <div className="container">
      <div className="card">
        {!sessionStarted ? (
          <>
            <h2>Hello {name}!</h2>
            <p>Choose session length:</p>
            {[10, 20, 30, 60].map((min) => (
              <button key={min} onClick={() => startSession(min)}>
                {min} min
              </button>
            ))}
          </>
        ) : (
          <>
            <h2>Time left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</h2>
            <p>Correct {correct} / {total}</p>
            <h3>{question.equation}</h3>
            <input
              type="text"
              placeholder="x = ?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="check-button" onClick={handleCheck}>✔</button>
          </>
        )}
      </div>
    </div>
  );
}

export default PracticeApp;

