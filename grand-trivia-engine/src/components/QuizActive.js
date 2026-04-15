import React, { useState, useEffect, use } from 'react';
import { shuffleAnswers } from '../utils/shuffler';

const QuizActive = ({ questions, settings, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timer, setTimer] = useState(15); // 15 seconds per question

  const currentQuestion = questions[currentIndex];

  //Timer logic
  useEffect(() => {
    if (isRevealed) return; // Pause timer when answer is revealed
    if (timer === 0) {
        handleAnswer(null); // Treat as incorrect if time runs out
        return;
    }
    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer, isRevealed]);

  //Shuffle answers whenever the question changes
  useEffect(() => {
    if (currentQuestion) {
        setTimer(15); // Reset timer for new question
        const allAnswers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        setShuffledAnswers(shuffleAnswers(allAnswers));
    }
  }, [currentIndex,currentQuestion]);

  //Handle answer selection
  const handleAnswer = (answer) => {
    if (isRevealed) return; // Prevent multiple clicks

    setSelectedAnswer(answer);
    setIsRevealed(true);

    // Check if the answer is correct and update score/lives
    const isCorrect = answer === currentQuestion.correct_answer;
    if (isCorrect) {
        const timeBonus = timer * 10; // Bonus points for remaining time
        setScore(prev => prev + 100 + timeBonus);
    } else {
      setLives(prev => prev - 1);
    }
    setTimeout(() => {
        if (lives <=1 && !isCorrect) {
            onComplete(score); // End game if lives are exhausted
        } else if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setIsRevealed(false);
        } else {
            onComplete(score); // End game if all questions are answered
        }
    }, 1500); // Delay to show feedback
};
//Show loader if questions or settings are not ready
    if (!settings || !questions || questions.length === 0) {
        return <div className="loader">Loading Questions...</div>;
    }

  return (
    <div className="quiz-screen">
        <div className="quiz-banner">
            <span className="category">{settings.category}</span>
            <span className="question-number">Question {currentIndex + 1} of {questions.length}</span>
            <span className="difficulty">{settings.difficulty.toUpperCase()}</span>
        </div>
        <div className="question-section">
            <h2 className="question" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
            <div className="answers-grid">
                {shuffledAnswers.map((answer, idx) => {
                    const isCorrect = answer === currentQuestion.correct_answer;
                    const isSelected = answer === selectedAnswer;

                    let btnStatus = '';
                    if (isRevealed) {
                        if (isCorrect) btnStatus = 'correct';
                        else if (isSelected) btnStatus = 'incorrect';
                    }
                    return (
                        <button
                            key={idx}
                            className={`answer-btn ${btnStatus}`}
                            onClick={() => handleAnswer(answer)}
                            disabled={isRevealed}
                        >
                            {answer}
                        </button>
                    );
                })}
            </div>
        </div>
        <div className="quiz-footer">
            <span className="score">Score: {score}</span>
            <span className="lives">Lives: {'❤️'.repeat(lives)}</span>
            <button className="quit-btn" onClick={() => onComplete(score)}>Quit</button>
        </div>
    </div>
  );
}

export default QuizActive;


