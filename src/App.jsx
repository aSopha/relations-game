import { useEffect, useState } from "react";
import viteLogo from "/vite.svg";
import WordBlock from "./WordBlock";
import SolvedCard from "./SolvedCard";
import Lives from "./Lives";
import { shuffle } from "./helper";
import puzzlesStub from "./puzzlesStub";
import "./App.css";

const MAX_LIVES = 4;
const puzzleIndex = Math.floor(Math.random() * puzzlesStub.length);

function App() {
  const [solutions, setSolutions] = useState(
    puzzlesStub[puzzleIndex].solutions
  );
  const [allWords, setAllWords] = useState(
    shuffle(puzzlesStub[puzzleIndex].allWords)
  );
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [completedCategories, setcompletedCategories] = useState([]);
  const [remainingLives, setRemainingLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [throttled, setThrottled] = useState(false)
  const [incorrectGuess, setIncorrectGuess] = useState(false)
  const [freshGame, setFreshGame] = useState(true)

  useEffect(() => {
    if (remainingLives < 1) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [remainingLives]);

  useEffect(() => {
    if (completedCategories.length >= 4) {
      setGameWon(true);
    }
  }, [completedCategories]);

  const wordCategoryMap = {};
  Object.assign(
    wordCategoryMap,
    ...solutions.map((solution) => {
      return solution.words.reduce((acc, word) => {
        acc[word] = solution.category;
        return acc;
      }, {});
    })
  );

  const filteredWords = allWords.filter((word) => {
    return !completedCategories.includes(wordCategoryMap[word]);
  });

  const filteredSolutions = solutions.filter((solution) => {
    return completedCategories.includes(solution.category);
  });

  const selectWord = (word) => {
    if (gameOver) {
      return;
    }
    const newSet = new Set(selectedWords);
    if (selectedWords.has(word)) {
      newSet.delete(word);
      setSelectedWords(newSet);
    } else if (selectedWords.size < 4) {
      newSet.add(word);
      setSelectedWords(newSet);
    }
  };

  const submitWords = () => {
    setThrottled(true)
    setFreshGame(false)
    const category = checkMatch();
    if (category) {
      setcompletedCategories([...completedCategories, category]);
      setSelectedWords(new Set());
    } else if (remainingLives > 0) {
      setRemainingLives(remainingLives - 1);
      setIncorrectGuess(true)
    }
    setTimeout(() => {
      setThrottled(false)
    }, 500)
  }

  const checkMatch = () => {
    let category;
    for (const word of selectedWords) {
      if (!category) {
        category = wordCategoryMap[word];
      } else {
        if (category !== wordCategoryMap[word]) {
          return false;
        }
      }
    }
    return category;
  };

  const clearSelection = () => {
    setSelectedWords(new Set());
    setIncorrectGuess(false)
  };

  const shuffleWords = () => {
    setAllWords(shuffle(allWords));
  };

  const newPuzzle = () => {
    const i = Math.floor(Math.random() * puzzlesStub.length);

    resetPuzzle();
    setSolutions(puzzlesStub[i].solutions);
    setAllWords(shuffle(puzzlesStub[i].allWords));
  };

  const resetPuzzle = () => {
    setSelectedWords(new Set());
    setcompletedCategories([]);
    setRemainingLives(MAX_LIVES);
    setGameWon(false)
    setIncorrectGuess(false)
  };

  let messageBody = 'Create four groups of four!'
  if (incorrectGuess) {
    messageBody = 'Wrong Guess';
  }
  if (gameOver) {
    messageBody = 'Game Over';
  }
  if (gameWon) {
    messageBody = 'You Win!';
  }

  const showMessage = gameOver || gameWon || incorrectGuess || freshGame

  const message = <div className={showMessage ? "message" : "message-hide"}>{messageBody}</div>;
  

  return (
    <>
      {message}
      <Lives remaining={remainingLives} max={MAX_LIVES} />
      <div className="word-grid">
        {filteredSolutions.map(({ category, words }, index) => (
          <SolvedCard key={index} category={category} words={words} />
        ))}
        {filteredWords.map((word, index) => (
          <WordBlock
            key={index}
            word={word}
            selectWord={selectWord}
            selected={selectedWords.has(word)}
          />
        ))}
      </div>
      <button
        className="noselect"
        onClick={clearSelection}
        disabled={selectedWords.size < 1 || gameOver}
      >
        Clear
      </button>
      <button
        className="noselect"
        onClick={shuffleWords}
        disabled={gameOver || gameWon}
      >
        Shuffle
      </button>
      <button
        className="noselect"
        onClick={submitWords}
        disabled={selectedWords.size < 4 || gameOver || throttled}
      >
        Submit
      </button>
      <button className="noselect" onClick={newPuzzle}>
        New Puzzle
      </button>
    </>
  );
}

export default App;
