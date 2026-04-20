import React, {useState} from 'react';
import StartScreen from './components/StartScreen';
import QuizActive from './components/QuizActive';
import {fetchQuestions} from './utils/api';
import ResultsScreen from './components/ResultsScreen';
import './App.css';

//Main app component that manages the overall state and flow of the trivia game
function App() {
  const [gameState, setGameState] = useState('START_SCREEN');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [settings, setSettings] = useState({ category: '', difficulty: '' });

  //Function to start the game by fetching questions based on selected settings
  const startGame = async (categoryID, category, difficulty) => {
    setLoading(true);
    setSettings({ category: category, difficulty: difficulty });
    const data = await fetchQuestions(categoryID, difficulty);
    if (data && data.length > 0) {
      setQuestions(data);
      setScore(0);
      setLoading(false);
      setGameState('QUIZ_ACTIVE');
    }
  };

  //Function to end the game and show results screen
  const endGame = (finalScore) => {
    const savedScores = JSON.parse(localStorage.getItem("triviaHighScores")) || [];
    //Create new score entry with settings
    const newEntry = {
      score : finalScore,
      category : settings.category,
      difficulty : settings. difficulty
    };
    const updatedScores = [...savedScores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    localStorage.setItem('triviaHighScores', JSON.stringify(updatedScores));
    setScore(finalScore);
    setGameState('RESULTS_SCREEN');
  };

  return (
    <div className="App">
      {loading && <div className="loader">Loading Questions...</div>}
      {!loading && (
        <>
          {gameState === 'START_SCREEN' && <StartScreen onStart={startGame} />}
          
          {gameState === 'QUIZ_ACTIVE' && (
            <QuizActive 
              questions={questions} 
              settings={settings}
              onComplete={endGame} // Pass the end function
            />
          )}
          
          {gameState === 'RESULTS_SCREEN' && (
            <ResultsScreen 
              score={score} 
              onRestart={() => setGameState('START_SCREEN')} 
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;