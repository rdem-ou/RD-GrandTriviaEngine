import React from 'react';

//Component to display final score and feedback after quiz completion, with option to restart the game
const ResultsScreen = ({ score, onRestart }) => {
  const getFeedback = () => { //Dynamically show a message based on the user's final score
    if (score >= 1500) return "Trivia Master! You're a genius!";
    if (score >= 1000) return "Great job! You know your stuff!";
    if (score >= 500) return "Not bad! A little more practice and you'll be a pro!";
    return "Better luck next time! Keep practicing!";
  };

  return (
    <div className="results-screen">
        <h2 className="feedback">{getFeedback()}</h2>
        <p className="final-score">Final Score: {score}</p>
        <button className="restart-btn" onClick={onRestart}>Play Again</button>
    </div>
  )
};

export default ResultsScreen;
