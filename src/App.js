
import styled from "styled-components";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';




const BIRD_HEIGHT = 73;
const BIRD_WIDTH = 103;
const WALL_HEIGHT = 590;
const WALL_WIDTH = 1200;
const GRAVITY = 4;
const OBJ_WIDTH = 7;

const OBJ_SPEED = 6;
const OBJ_GAP = 200;
function App() {
  const [isStart, setIsStart] = useState(false);
  const [birdpos, setBirspos] = useState(300);
  const [objHeight, setObjHeight] = useState(0);
  const [objPos, setObjPos] = useState(WALL_WIDTH);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleGameOver = () => {
    setIsStart(false);
    setIsGameOver(true);
    setBirspos(300);
    setScore(0);
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setIsStart(true);
  };

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >= WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;

    if (objPos >= OBJ_WIDTH && objPos <= OBJ_WIDTH + 80 && (topObj || bottomObj)) {
      handleGameOver();
    }
  }, [isStart, birdpos, objHeight, objPos]);

 
 

  









  useEffect(() => {
    let intVal;
    if (isStart && birdpos < WALL_HEIGHT - BIRD_HEIGHT) {
      intVal = setInterval(() => {
        setBirspos((birdpos) => birdpos + GRAVITY);
      }, 24);

    }
   
    return () => clearInterval(intVal);
  });

  useEffect(() => {
    let objval;
    if (isStart && objPos >= -OBJ_WIDTH) {
      objval = setInterval(() => {
        setObjPos((objPos) => objPos - OBJ_SPEED);
      }, 24 );

      return () => {
        clearInterval(objval);
       
      };
    } else {
      setObjPos(WALL_WIDTH);
      setObjHeight(Math.floor(Math.random() * (WALL_HEIGHT - OBJ_GAP)));
      if (isStart) setScore((score) => score + 5);
    }

    
    









  }, [isStart, objPos]);

  useEffect(() => {
    let topObj = birdpos >= 0 && birdpos < objHeight;
    
    let bottomObj =
      birdpos <= WALL_HEIGHT &&
      birdpos >=
        WALL_HEIGHT - (WALL_HEIGHT - OBJ_GAP - objHeight) - BIRD_HEIGHT;
    

    if (
      objPos >= OBJ_WIDTH &&
      objPos <= OBJ_WIDTH + 30 &&
      (topObj || bottomObj)
    )
    
     {
      setIsStart(false);
      setBirspos(300);
      setScore(0);
    }
  }, [isStart, birdpos, objHeight, objPos]);
  const handler = () => {
    if (!isStart) setIsStart(true);
    else if (birdpos < BIRD_HEIGHT) setBirspos(0);
    else setBirspos((birdpos) => birdpos - 50);
  };

  return (
   
    <Home onClick={handler}>
    <center> <h1 style={{fontFamily:"cursive",color:"darkyellow"}}><b style={{color:"red"}}>Iron</b> Mania</h1> <span className="scoreboard" style={{fontFamily:"cursive" ,color:"red",fontSize:"20px",fontWeight:"900"}}> Your Score: {score}</span></center>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Background height={WALL_HEIGHT} width={WALL_WIDTH}>

      {!isStart && !isGameOver ? <Startboard>Click To Start</Startboard> : null}
      {isGameOver && <GameOverMessage><center><h1 style={{color:"white"}}>Game Over!</h1> <br/></center><center>
      <Button style={{background:"red",color:"white",borderRadius:"20px",height:"60px",width:"110px"}} onClick={handleRestart} variant="danger">TRY AGAIN</Button></center></GameOverMessage>} {/* Render game over message */}
    
      
       
       
     
        <Obj
          height={objHeight}
          width={OBJ_WIDTH}
          left={objPos}
          top={0}
          deg={180}
        />
        <Bird
          height={BIRD_HEIGHT}
          width={BIRD_WIDTH}
          top={birdpos}
          left={100}
        />
        <Obj
          height={WALL_HEIGHT - OBJ_GAP - objHeight}
          width={OBJ_WIDTH}
          left={objPos}
          top={WALL_HEIGHT - (objHeight + (WALL_HEIGHT - OBJ_GAP - objHeight))}
          deg={0}
        />
      </Background>
    </Home>
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

const Bird = styled.div`
  position: absolute;
  background-image: url("./images/irony-unscreen.gif");
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
  font-family:cursive;
  border: 7px solid black;
`;

const ScoreShow = styled.div`
  text-align: center;
  background: transparent;
  font-family:cursive
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
