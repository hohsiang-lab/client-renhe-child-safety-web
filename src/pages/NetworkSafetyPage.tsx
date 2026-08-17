import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { networkQuestions } from "../data/networkSafety";

export default function NetworkSafetyPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const question = networkQuestions[index];

  function restart() {
    setIndex(0);
    setScore(0);
    setAnswered(null);
    setDone(false);
  }

  function choose(option: number) {
    if (answered !== null) return;
    setAnswered(option);
    if (option === question.correctIndex) setScore((n) => n + 1);
  }

  function next() {
    if (index === networkQuestions.length - 1) setDone(true);
    else {
      setIndex((n) => n + 1);
      setAnswered(null);
    }
  }

  if (done) {
    return (
      <main className="game-shell">
        <section className="completion-card" aria-live="polite">
          <span className="completion-icon" aria-hidden="true">✓</span>
          <h1>網路安全完成！</h1>
          <p>你答對了 {score} / {networkQuestions.length} 題</p>
          <p>遇到網路危險時：停止回應、保留證據、封鎖並求助。</p>
          <div className="button-row">
            <button className="primary-button" onClick={restart}>再玩一次</button>
            <button className="secondary-button" onClick={() => navigate("/menu")}>回主選單</button>
          </div>
        </section>
      </main>
    );
  }

  const correct = answered === question.correctIndex;
  return (
    <main className="game-shell">
      <header className="game-header">
        <div>
          <span className="eyebrow">仁和社區兒童安全學習</span>
          <h1>網路安全</h1>
        </div>
        <div className="button-row compact">
          <button className="text-button" onClick={() => document.documentElement.requestFullscreen?.()}>全螢幕</button>
          <button className="text-button" onClick={() => navigate("/menu")}>回主選單</button>
        </div>
      </header>
      <div className="facilitator-bar">
        <label>
          選擇題目
          <select aria-label="選擇網路安全題目" value={index} onChange={(event) => { setIndex(Number(event.target.value)); setAnswered(null); }}>
            {networkQuestions.map((item, itemIndex) => <option key={item.id} value={itemIndex}>第 {itemIndex + 1} 題</option>)}
          </select>
        </label>
        <button className="secondary-button" onClick={restart}>重新開始</button>
      </div>
      <div className="progress-wrap" aria-label={`第 ${index + 1} / ${networkQuestions.length} 題`}>
        <div className="progress-label"><span>第 {index + 1} / {networkQuestions.length} 題</span><span>答對 {score} 題</span></div>
        <div className="progress-track"><div className="progress-value" style={{ width: `${((index + 1) / networkQuestions.length) * 100}%` }} /></div>
      </div>
      <section className="question-card">
        <span className="question-tag">網路情境</span>
        <p className="question-text">{question.scenario}</p>
        <div className="answer-list">
          {question.options.map((option, optionIndex) => (
            <button
              key={option}
              className={`choice-button ${answered !== null && optionIndex === question.correctIndex ? "correct" : ""} ${answered === optionIndex && optionIndex !== question.correctIndex ? "incorrect" : ""}`}
              onClick={() => choose(optionIndex)}
              disabled={answered !== null}
            >
              {option}
            </button>
          ))}
        </div>
        {answered !== null && <div className={`feedback ${correct ? "success" : "error"}`} role="status"><b>{correct ? "答對了！好棒！" : "再想想看喔～"}</b><span>{question.explanation}</span></div>}
        {answered !== null && <button className="primary-button full-button" onClick={next}>{index === networkQuestions.length - 1 ? "完成" : "下一題"}</button>}
      </section>
    </main>
  );
}
