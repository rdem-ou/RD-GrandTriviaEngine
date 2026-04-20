import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../utils/api';

//Component for users to select a cataegory and difficulty before starting the quiz
const StartScreen = ({ onStart }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('9'); // Default to General Knowledge
  const [selectedDifficulty, setDifficulty] = useState('easy');
  const [highScores, setHighScores] = useState([]);

  //Fetch categories from API when component mounts
  useEffect(() => {
    const initScreens = async () => {
      const data = await fetchCategories();
      setCategories(data);
      const saved = JSON.parse(localStorage.getItem('triviaHighScores')) || [];
      setHighScores(saved);
    };
    initScreens();
  }, []);

  //Handle start button click
  const handleStart = () => {
    const categoryObj = categories.find(cat => cat.id.toString() === selectedCategory);
    const categoryName = categoryObj ? categoryObj.name : 'General Knowledge';
    onStart(selectedCategory, categoryName, selectedDifficulty);
  };
  
return (
    <div className="start-screen"> 
        <h1 className="title">Grand Trivia Engine</h1>
        <div className="categories">
            <label htmlFor="category">Select Category:</label>
            <select className="category-menu" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="difficulty">
            <label>
                <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={selectedDifficulty === 'easy'}
                onChange={(e) => setDifficulty(e.target.value)}
                />
                Easy
            </label>

            <label>
                <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={selectedDifficulty === 'medium'}
                onChange={(e) => setDifficulty(e.target.value)}
                />
                Medium
            </label>

            <label>
                <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={selectedDifficulty === 'hard'}
                onChange={(e) => setDifficulty(e.target.value)}
                />
                Hard
            </label>
        </div>
        <div className="start-button">
            <button className="start-btn"onClick={handleStart}>Start Quiz</button>
        </div>
        {highScores.length > 0 && (  
          <div className="leaderboard-section">
            <h3>🏆Top 5 Scores🏆</h3>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Score</th>
                  <th>Category</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {highScores.map((score, index) => (
                  <tr key={index}>
                    <td>{score.score}</td>
                    <td>{score.category}</td>
                    <td>{score.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
);
}
export default StartScreen;