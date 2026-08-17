import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { secretQuestions } from "../data/secrets";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

type Phase = "playing" | "wrong" | "correct" | "complete";
const questions = secretQuestions.slice(0, 6);

export default function SecretGamePage() {
  const navigate = useNavigate();
  const { play, stop } = useAudioPlayer();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("playing");
  const [selected, setSelected] = useState<"good" | "bad" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = questions[index];

  useEffect(() => () => {
    stop();
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [stop]);

  function answer(value: "good" | "bad") {
    if (phase !== "playing") return;
    stop();
    setSelected(value);
    if (value === current.answer) {
      setScore((n) => n + 1);
      setPhase("correct");
      play(`/audio/secret-q${current.id}-correct.mp3`);
      timerRef.current = window.setTimeout(next, 1500);
    } else {
      setPhase("wrong");
      play(`/audio/secret-q${current.id}-wrong.mp3`);
    }
  }

  function next() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (index === questions.length - 1) setPhase("complete");
    else {
      setIndex((n) => n + 1);
      setSelected(null);
      setPhase("playing");
    }
  }

  function retry() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSelected(null);
    setPhase("playing");
    play(`/audio/secret-q${current.id}-scenario.mp3`);
  }

  if (phase === "complete") {
    return (
      <main className="game-shell">
        <section className="completion-card" aria-live="polite">
          <span className="completion-icon" aria-hidden="true">✓</span>
          <h1>遊戲完成！</h1>
          <p>你答對了 {score} / {questions.length} 題</p>
          {score === questions.length && <strong>太厲害了，全部答對！</strong>}
          <div className="button-row">
            <button className="primary-button" onClick={() => { setIndex(0); setScore(0); setSelected(null); setPhase("playing"); }}>
              再玩一次
            </button>
            <button className="secondary-button" onClick={() => navigate("/menu")}>回主選單</button>
            <button className="secondary-button" onClick={() => navigate("/ending")}>完成</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="game-shell">
      <header className="game-header">
        <div><span className="eyebrow">仁和社區兒童安全學習</span><h1>秘密遊戲</h1></div>
        <div className="button-row compact"><button className="text-button" onClick={() => document.documentElement.requestFullscreen?.()}>全螢幕</button><button className="text-button" onClick={() => navigate("/menu")}>回主選單</button></div>
      </header>
      <div className="progress-wrap" aria-label={`第 ${index + 1} / ${questions.length} 題`}>
        <div className="progress-label"><span>第 {index + 1} / {questions.length} 題</span><span>答對 {score} 題</span></div>
        <div className="progress-track"><div className="progress-value" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      </div>
      <div className="facilitator-bar">
        <label>
          選擇題目
          <select aria-label="選擇秘密題目" value={index} onChange={(event) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setIndex(Number(event.target.value));
            setSelected(null);
            setPhase("playing");
          }}>
            {questions.map((question, questionIndex) => <option key={question.id} value={questionIndex}>第 {questionIndex + 1} 題</option>)}
          </select>
        </label>
        <button className="secondary-button" onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setIndex(0); setScore(0); setSelected(null); setPhase("playing"); }}>重新開始</button>
      </div>
      <motion.section className="question-card" key={current.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <span className="question-tag">情境題</span>
        <p className="question-text text-lg leading-relaxed">{current.scenario}</p>
        {phase === "correct" && <div className="feedback success" role="status"><b>⭐ 答對了！好棒！</b><span>這是{current.answer === "good" ? "好" : "壞"}秘密。{current.explanation}</span></div>}
        {phase === "wrong" && <div className="feedback error" role="status"><b>不太對喔～</b><span>{current.explanation}</span></div>}
        <button className="text-button" onClick={() => play(`/audio/secret-q${current.id}-scenario.mp3`)}>重播題目語音</button>
        <div className="answer-grid">
          <button className={`answer-button good ${selected === "good" ? "selected" : ""}`} onClick={() => answer("good")} disabled={phase !== "playing"}><span aria-hidden="true">○</span>好秘密</button>
          <button className={`answer-button bad ${selected === "bad" ? "selected" : ""}`} onClick={() => answer("bad")} disabled={phase !== "playing"}><span aria-hidden="true">×</span>壞秘密</button>
        </div>
        {phase === "wrong" && <button className="primary-button full-button" onClick={index === questions.length - 1 ? () => setPhase("complete") : next}>我知道了</button>}
        {current.answer === "bad" && phase !== "playing" && <div className="safety-steps"><b>遇到壞秘密，記得：</b><span>1. 說不要</span><span>2. 離開</span><span>3. 告訴可信任的大人</span></div>}
        {phase === "wrong" && <button className="text-button retry-button" onClick={retry}>再試一次</button>}
      </motion.section>
    </main>
  );
}
