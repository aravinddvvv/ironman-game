import styled from "styled-components";
import styledd, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import SplashScreen from './Splashscreen';
import useSound from 'use-sound';
import intro from './audio/ironman.mp3'; // Import background music
import gameoverSound from './audio/gameover.mp3'; // Import game-over sound

const BIRD_HEIGHT = 73;
const BIRD_WIDTH = 103;
const WALL_HEIGHT = 590;
const WALL_WIDTH = 1200;
const GRAVITY = 4;
const OBJ_WIDTH = 7;

const OBJ_SPEED = 6;
const OBJ_GAP = 200;

// Bird GIFs
const IRONMAN_GIF = "./images/irony-unscreen.gif";
const GAMEOVER_GIF = "./images/gosty.gif";  // New GIF when game is over

function App() {
  // States for splash screen and game
  const [isLoaded, setIsLoaded] = useState(false); // For Splash Screen
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirspos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [level, setLevel] = useState(1); // New state to track level
  const [showLevel, setShowLevel] = useState(false); // State to toggle level display


  // Bird GIF state
  const [birdGif, setBirdGif] = useState(IRONMAN_GIF);  // Default GIF for Ironman

  // Splash Screen Timeout and Sounds
  const [playIntro, { stop: stopIntro }] = useSound(intro, { loop: true });
  const [playGameOver] = useSound(gameoverSound);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      playIntro();
    }, 14500); // Show splash screen for 14.5 seconds
    return () => clearTimeout(timer);
  }, [playIntro]);

   // Level Up logic based on score
   useEffect(() => {
    if (score % 20 === 0 && score > 0) {
      setLevel((prevLevel) => prevLevel + 1); // Increment level
      setShowLevel(true); // Show level message
      setTimeout(() => setShowLevel(false), 2000); // Hide after 2 seconds
    }
  }, [score]);

  // Game Over handler
  const handleGameOver = () => {
    setIsStart(false);
    setIsGameOver(true);
    setBirdGif(GAMEOVER_GIF);  // Change to Game Over GIF
    setBirspos(300);
    setScore(0);
    setLevel(1);  // Reset level on game over
    
    // Stop the intro/background music and play the game-over sound
    stopIntro(); 
    playGameOver();
  };

  // Restart handler
  const handleRestart = () => {
    setIsGameOver(false);
    setIsStart(true);
    setBirdGif(IRONMAN_GIF);
    setScore(0);  // Reset score
    setLevel(1); 
      // Reset back to Ironman GIF
    
    // Restart the background music after a short delay
    setTimeout(() => {
      playIntro();
    }, 200); // Delay is optional
  };

  // Collision detection
  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj = birdpos <= WALL_HEIGHT && birdpos >= WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (objPos >= OBJ_WIDTH && objPos <= OBJ_WIDTH + 80 && (topObj || bottomObj)) {
      handleGameOver();
    }
  }, [isStart, birdpos, objHeight, objPos]);

  // Bird movement with gravity
  useEffect(() => {
    let intVal;
    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirspos((birdpos) => birdpos + GRAVITY);
      }, 24);
    }
    return () => clearInterval(intVal);
  });

  // Object movement
  useEffect(() => {
    let objval;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24);

      return () => clearInterval(objval);
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 5);
    }
  }, [isStart, objPos]);

  // Bird control handler
  const handler = () => {
    if (!isStart) setIsStart(true);
    else if (birdpos < BIRD_HEIGHT) setBirspos(0);
    else setBirspos((birdpos) => birdpos - 50);
  };

  // Rendering the splash screen first, then the game
  return (
    <div className="App">
      {!isLoaded ? (
        <SplashScreen />  // Show Splash Screen
      ) : (
        <Home onClick={handler}>
          <center>
            <h1 style={{ fontFamily: "cursive", color: "darkyellow" }}>
              <b style={{ color: "red" }}>Iron</b> Mania
            </h1>
            <span className="scoreboard" style={{ fontFamily: "cursive", color: "red", fontSize: "20px", fontWeight: "900" }}>
              Your Score: {score}
            </span>
          </center>
          <Background height={WALL_HEIGHT} width={WALL_WIDTH}>
             {/* Display Level Animation */}
             {showLevel && <LevelDisplay>Level {level}</LevelDisplay>}
            {!isStart && !isGameOver ? <Startboard>Click To Start</Startboard> : null}
            {isGameOver && (
              <GameOverMessage>
                <center>
                  <h1 style={{ color: "white" }}>Game Over!</h1>
                  <Button style={{ background: "red", color: "white", borderRadius: "20px", height: "60px", width: "110px" }} onClick={handleRestart} variant="danger">
                    TRY AGAIN
                  </Button>
                </center>
              </GameOverMessage>
            )}
            <Obj height={objHeight} width={OBJ_WIDTH} left={objPos} top={0} deg={180} />
            <Bird height={BIRD_HEIGHT} width={BIRD_WIDTH} top={birdpos} left={100} gif={birdGif} />
            <Obj height={WALL_HEIGHT - OBJ_GAP - objHeight} width={OBJ_WIDTH} left={objPos} top={WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))} deg={0} />
          </Background>
        </Home>
      )}
    </div>
  );
}

export default App;  


const Home = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Background = styled.div`
  background-image: url("./images/aru.gif");
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: relative;
  overflow: hidden;
  border: 15px solid black;
`;

const LevelDisplay = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
  font-weight: bold;
  color: yellow;
  background-color: black;
  padding: 10px 20px;
  border-radius: 10px;
  animation: fadeInOut 2s ease-in-out;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url(${(props) => props.gif});  
  background-repeat: no-repeat;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
`;

const Obj = styled.div`
  position: relative;
  background-image: url("./images/pill.png");
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  transform: rotate(${(props) => props.deg}deg);
`;

const Startboard = styled.div`
  position: relative;
  top: 49%;
  background-color: black;
  padding: 10px;
  width: 100px;
  left: 50%;
  margin-left: -50px;
  text-align: center;
  font-size: 20px;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  font-family: cursive;
  border: 7px solid black;
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;


const GameOverMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: transparent;
  padding: 10px;
  border-radius: 5px;
  color: white;
  font-size: 24px;
  font-weight: bold;
`;
