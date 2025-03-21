import React, { useState, useEffect } from 'react';
import './Game.css';
import monsterSprite from './monster.png'; // Import the sprite

function Game() {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [playerGold, setPlayerGold] = useState(0);
  const [stars, setStars] = useState(0);
  const [starVisible, setStarVisible] = useState(true);
  const [starPosition, setStarPosition] = useState({ top: '50%', left: '50%' });
  const [message, setMessage] = useState('Welcome to the RPG!');
  const [enemies, setEnemies] = useState([]); // Add this line
  const [gameTime, setGameTime] = useState(0);
  const [spriteFrame, setSpriteFrame] = useState(0);

  // useEffect for game timer and enemy spawning
  useEffect(() => {
    const timer = setInterval(() => {
      setGameTime(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // useEffect for sprite animation
  useEffect(() => {
    const animationTimer = setInterval(() => {
      setSpriteFrame(prev => (prev + 1) % 4);
    }, 250);
    
    return () => clearInterval(animationTimer);
  }, []);

  // useEffect to spawn enemies based on game time
  useEffect(() => {
    if (gameTime > 0 && gameTime % 5 === 0) {
      const newEnemy = {
        id: Date.now(),
        health: 20,
        position: {
          top: `${Math.floor(Math.random() * 70) + 10}%`,
          left: `${Math.floor(Math.random() * 70) + 10}%`
        }
      };
      
      setEnemies(prevEnemies => [...prevEnemies, newEnemy]);
      setMessage(`A new enemy has appeared! (${gameTime}s)`);
    }
  }, [gameTime]);

  const explore = () => {
    const chance = Math.random();
    if (chance < 0.5) {
      const gold = Math.floor(Math.random() * 10) + 1;
      setPlayerGold(playerGold + gold);
      setMessage(`You found ${gold} gold!`);
    } else {
      const damage = Math.floor(Math.random() * 10) + 1;
      setPlayerHealth(Math.max(0, playerHealth - damage));
      setMessage(`You took ${damage} damage!`);
    }
  };

  const collectStar = () => {
    setStars(stars + 1);
    setStarVisible(false);
    setMessage("You collected a star!");
    
    setTimeout(() => {
      const newTop = Math.floor(Math.random() * 70) + 10;
      const newLeft = Math.floor(Math.random() * 70) + 10;
      setStarPosition({ top: `${newTop}%`, left: `${newLeft}%` });
      setStarVisible(true);
    }, 2000);
  };

  // Add the attackEnemy function
  const attackEnemy = (enemyId) => {
    setEnemies(prevEnemies => 
      prevEnemies.map(enemy => {
        if (enemy.id === enemyId) {
          const newHealth = enemy.health - 10;
          if (newHealth <= 0) {
            setMessage("Enemy defeated! +5 gold");
            setPlayerGold(prevGold => prevGold + 5);
            return null;
          }
          return {...enemy, health: newHealth};
        }
        return enemy;
      }).filter(Boolean)
    );
  };

  return (
    <div className="game">
      <div className="star-counter">⭐ {stars}</div>
      <div className="game-timer">Time: {gameTime}s</div>
      
      <h1>Simple RPG</h1>
      <div className="stats">
        <p>Health: {playerHealth}</p>
        <p>Gold: {playerGold}</p>
      </div>
      <p className="message">{message}</p>
      <button onClick={explore}>Explore</button>
      
      {starVisible && (
        <div 
          className="star" 
          style={{ top: starPosition.top, left: starPosition.left }}
          onClick={collectStar}
        >
          ⭐
        </div>
      )}

{enemies.map(enemy => (
  <div 
    key={enemy.id}
    className="enemy" 
    style={{ top: enemy.position.top, left: enemy.position.left }}
    onClick={() => attackEnemy(enemy.id)}
  >
    <div 
      className="enemy-sprite"
      style={{ 
        backgroundImage: `url(${monsterSprite})`,
        backgroundPosition: `-${spriteFrame * 32}px 0` 
      }} 
    ></div>
    <div className="enemy-health">{enemy.health}</div>
  </div>
))}
    </div>
  );
}

export default Game;