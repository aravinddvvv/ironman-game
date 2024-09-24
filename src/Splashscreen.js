import React, { useEffect, useState } from 'react';
import './Splashscreen.css';
import kambialiyan from './/Assets/ironmangif.gif' ;



const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
 

  // Set a timer to hide the splash screen after a few seconds
  useEffect(() => {

    const timer = setTimeout(() => {
      setIsVisible(false);
     
    }, 14500); 
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null; // Don't render the splash screen if not visible
  

  return (
    <div className="splash-screen">
      <img src={kambialiyan} alt="Iron Man Logo" className="logo" />
      <h1 className='fonty'>Iron   Mania</h1>
      <h5 className='developer'>Developed by Aravind V </h5>
    </div>
  );
};

export default SplashScreen;

