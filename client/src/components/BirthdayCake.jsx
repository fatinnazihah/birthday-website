import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = ({ onComplete }) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);
  const [showWind, setShowWind] = useState(false);
  
  const audioPlayerRef = useRef(null); 
  const blowIntervalRef = useRef(null);
  const totalCandles = 5; 

  const startBlowing = () => {
    // 1. Play Wind/Music Sound
    if(audioPlayerRef.current) {
        audioPlayerRef.current.volume = 0.5;
        audioPlayerRef.current.play().catch(e => console.log("Audio Error:", e));
    }

    setIsBlowing(true);
    setShowWind(true);

    // 2. Extinguish candles over time
    blowIntervalRef.current = setInterval(() => {
        setCandlesBlown(prev => {
            if (prev >= totalCandles) return totalCandles;
            return prev + 0.05; // Adjust speed of blowing here
        });
    }, 50); // Runs every 50ms
  };

  const stopBlowing = () => {
      setIsBlowing(false);
      setShowWind(false);
      if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.currentTime = 0;
      }
      if (blowIntervalRef.current) {
          clearInterval(blowIntervalRef.current);
      }
  };

  // Check for completion
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          stopBlowing();
          if (onComplete) onComplete();
      }
  }, [candlesBlown, totalCandles, onComplete]); 

  // Clean up on unmount
  useEffect(() => {
      return () => {
          if (blowIntervalRef.current) clearInterval(blowIntervalRef.current);
      };
  }, []);

  return (
    <div className="cake-wrapper">
      {/* Ensure you have a 'wind.mp3' or keep using 'birthday-song.mp3' */}
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '400px', margin: '0 auto'}}>
        <div className="title-bar">
            <div className="title-text" style={{color:'white'}}>🎂 celebration.exe</div>
            <div className="title-controls"><div className="control-btn">X</div></div>
        </div>
        
        <div className="window-content" style={{textAlign: 'center', background: '#E0F7FA', minHeight:'280px', position:'relative', overflow:'hidden'}}>
            
            {/* WIND PARTICLES OVERLAY */}
            {showWind && (
                <div className="wind-particles">
                    <div className="wind-line" style={{top: '20%', width: '50px', animationDuration: '0.3s'}}></div>
                    <div className="wind-line" style={{top: '40%', width: '80px', animationDuration: '0.4s', animationDelay: '0.1s'}}></div>
                    <div className="wind-line" style={{top: '60%', width: '40px', animationDuration: '0.2s', animationDelay: '0.2s'}}></div>
                    <div className="wind-line" style={{top: '30%', width: '70px', animationDuration: '0.5s'}}></div>
                </div>
            )}

            {Math.floor(candlesBlown) >= totalCandles ? (
                 <div className="success-message" style={{paddingTop: '40px'}}>
                     <h2 style={{color: 'green', textShadow: '2px 2px 0 #fff', fontSize: '24px'}}>✨ WISH GRANTED! ✨</h2>
                     <p style={{fontFamily: 'sans-serif', marginTop: '10px'}}>UNLOCKING CONTENT...</p>
                 </div>
            ) : (
                <>
                    <div style={{marginBottom: '20px'}}>
                        <p style={{fontFamily: 'Verdana', fontSize: '12px', fontWeight: 'bold'}}>
                            HOLD THE BUTTON TO BLOW!
                        </p>
                    </div>

                    <div className="pixel-cake">
                        <div className="candle-row">
                            {[...Array(totalCandles)].map((_, i) => (
                                <div key={i} className="pixel-candle">
                                    {/* Show flame if not blown out yet */}
                                    {i >= Math.floor(candlesBlown) && (
                                        <div className={`pixel-flame ${isBlowing ? 'blowing' : ''}`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="icing-layer"></div>
                        <div className="top-layer"></div>
                        <div className="middle-layer"></div>
                        <div className="bottom-layer"></div>
                    </div>

                    {/* THE BIG ACTION BUTTON */}
                    <div style={{marginTop: '40px'}}>
                        <button 
                            className="retro-btn"
                            style={{
                                padding: '15px 30px', 
                                fontWeight: 'bold', 
                                background: isBlowing ? '#add8e6' : '#c0c0c0',
                                transform: isBlowing ? 'scale(0.95)' : 'scale(1)',
                                border: '3px solid black',
                                userSelect: 'none' /* Prevents text selection on mobile tap */
                            }}
                            onMouseDown={startBlowing}
                            onMouseUp={stopBlowing}
                            onMouseLeave={stopBlowing}
                            onTouchStart={startBlowing}
                            onTouchEnd={stopBlowing}
                        >
                            {isBlowing ? '🌬️ BLOWING...' : '💨 HOLD TO BLOW'}
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;