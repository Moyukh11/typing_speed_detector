import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { PROMPTS } from './data/prompts';
import './App.css';

function getAccuracy(target, typed) {
  const correctChars = target.split('').reduce((count, char, idx) => {
    return count + (typed[idx] === char ? 1 : 0);
  }, 0);
  return target.length ? Math.max(0, Math.round((correctChars / target.length) * 100)) : 0;
}

function getMistakes(target, typed) {
  const correctChars = target.split('').reduce((count, char, idx) => {
    return count + (typed[idx] === char ? 1 : 0);
  }, 0);
  return Math.max(0, target.length - correctChars);
}

function App() {
  const [targetText, setTargetText] = useState(PROMPTS[0]);
  const [typedText, setTypedText] = useState('');
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
    setTargetText(PROMPTS[Math.floor(Math.random() * PROMPTS.length)]);
  }, []);

  const durationSeconds = useMemo(() => {
    if (!startedAt || !finishedAt) return 0;
    return Math.max(0, Math.round((finishedAt - startedAt) / 1000));
  }, [startedAt, finishedAt]);

  const wordsCount = useMemo(() => {
    return typedText.trim().length ? typedText.trim().split(/\s+/).length : 0;
  }, [typedText]);

  const wpm = useMemo(() => {
    return durationSeconds ? Math.round((wordsCount / durationSeconds) * 60) : 0;
  }, [wordsCount, durationSeconds]);

  const accuracy = useMemo(() => getAccuracy(targetText, typedText), [targetText, typedText]);

  const mistakes = useMemo(() => getMistakes(targetText, typedText), [targetText, typedText]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/sessions');
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load history');
    }
  };

  const finishTyping = async () => {
    if (!startedAt) return;
    const endTime = Date.now();
    const finalDurationSeconds = Math.max(1, Math.round((endTime - startedAt) / 1000));
    const finalWpm = Math.round((wordsCount / finalDurationSeconds) * 60);
    const payload = {
      wpm: finalWpm,
      accuracy,
      durationSeconds: finalDurationSeconds,
      mistakes,
      targetText,
      typedText,
    };

    setFinishedAt(endTime);

    try {
      setLoading(true);
      const res = await axios.post('/api/sessions', payload);
      setResult(res.data);
      setHistory(prev => [res.data, ...prev]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Unable to save results');
      setLoading(false);
    }
  };

  const handleChange = event => {
    if (!startedAt) {
      setStartedAt(Date.now());
      setFinishedAt(null);
      setResult(null);
      setError('');
    }
    setTypedText(event.target.value);
  };

  const resetTest = () => {
    const next = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    setTargetText(next);
    setTypedText('');
    setStartedAt(null);
    setFinishedAt(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Typing Speed Detector</h1>
        <p>Measure your speed, accuracy, and track typing sessions.</p>
      </header>

      <main>
        <section className="typing-panel">
          <div className="target-card">
            <h2>Sample Text</h2>
            <p>{targetText}</p>
          </div>

          <textarea
            value={typedText}
            onChange={handleChange}
            placeholder="Start typing here..."
            rows="6"
          />

          <div className="controls">
            <button onClick={finishTyping} disabled={!typedText || loading}>
              Finish
            </button>
            <button onClick={resetTest}>Reset</button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>WPM</span>
              <strong>{wpm}</strong>
            </div>
            <div className="stat-card">
              <span>Accuracy</span>
              <strong>{accuracy}%</strong>
            </div>
            <div className="stat-card">
              <span>Duration</span>
              <strong>{durationSeconds}s</strong>
            </div>
            <div className="stat-card">
              <span>Mistakes</span>
              <strong>{mistakes}</strong>
            </div>
          </div>

          {result && (
            <div className="result-card">
              <h3>Session Saved</h3>
              <p>WPM: {result.wpm} | Accuracy: {result.accuracy}% | Duration: {result.durationSeconds}s</p>
            </div>
          )}
          {error && <p className="error-text">{error}</p>}
        </section>

        <aside className="history-panel">
          <h2>Session History</h2>
          {history.length === 0 ? (
            <p>No sessions yet. Finish a test to save your first result.</p>
          ) : (
            <div className="history-list">
              {history.map(session => (
                <article key={session._id} className="history-item">
                  <div>
                    <strong>{session.wpm} WPM</strong>
                    <span>{session.accuracy}% accuracy</span>
                  </div>
                  <div>
                    <small>{new Date(session.createdAt).toLocaleString()}</small>
                    <small>{session.durationSeconds}s</small>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}

export default App;
