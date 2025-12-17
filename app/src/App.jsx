import { useMemo, useState } from 'react';
import './App.css';
import data from './hiragana-unicode.json';

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  const items = useMemo(() => data.map(d => ({ id: d.name, char: d.char, unicode: d.unicode })), []);
  const [order, setOrder] = useState(items);
  const [revealed, setRevealed] = useState(() => new Set());

  const onCardClick = (id) => {
    setRevealed(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const revealAll = () => setRevealed(new Set(items.map(i => i.id)));
  const hideAll = () => setRevealed(new Set());
  const doShuffle = () => setOrder(prev => shuffle(prev));
  const resetOrder = () => setOrder(items);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Hiragana Flashcards</h1>
        <div className="controls">
          <button className="btn" onClick={doShuffle}>Shuffle</button>
          <button className="btn" onClick={resetOrder}>Reset Order</button>
          <button className="btn" onClick={revealAll}>Reveal All</button>
          <button className="btn" onClick={hideAll}>Hide All</button>
        </div>
        <p className="subtitle">Click a card to reveal its codepoint. Sounds can be added later.</p>
      </header>

      <section className="flashcards-grid">
        {order.map(item => {
          const isRevealed = revealed.has(item.id);
          return (
            <div
              key={item.id}
              className={`flashcard ${isRevealed ? 'revealed' : ''}`}
              role="button"
              tabIndex={0}
              aria-pressed={isRevealed}
              onClick={() => onCardClick(item.id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCardClick(item.id); }}
            >
              <div className="flashcard-front">
                <div className="flashcard-char">{item.char}</div>
                <div className="flashcard-id">{item.id}</div>
              </div>
              <div className="flashcard-back">
                <div className="flashcard-unicode">{item.unicode}</div>
                <div className="flashcard-sound">sound: —</div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
