import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = () => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioPlayerRef = useRef(null); 

  const totalCandles = 5; 

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopMusic();
    };
  }, []);

  const startMusic = () => {
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5;
          // Try to play, but handle browser autoplay blocks
          const playPromise = audioPlayerRef.current.play();
          if (playPromise !== undefined) {
              playPromise.catch(error => console.log("Audio play failed:", error));
          }
      }
  };

  const stopMusic = () => {
      if(audioPlayerRef.current) {
          audioPlayerRef.current.pause();
          audioPlayerRef.current.currentTime = 0;
      }
  };

  const startListening = async () => {
    try {
      // 1. Start Music First (User interaction allowed)
      startMusic();

      // 2. Request Mic
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      setIsListening(true);

      // 3. Setup Audio Analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 512; 
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);
      detectBlow();

    } catch (err) {
      console.error("Mic Error:", err);
      // Even if mic fails, let music play so they can manual blow
      startMusic(); 
      alert("Microphone not found or blocked! Use the 'Blow' button instead.");
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current || !isListening) return;
    
    // Stop loop if candles are done
    if (candlesBlown >= totalCandles) return; 

    requestAnimationFrame(detectBlow);
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = (dataArrayRef.current[i] - 128) / 128; 
      sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);

    // FIX: Lower threshold (0.02 is much easier to trigger)
    const BLOW_THRESHOLD = 0.02; 

    if (rms > BLOW_THRESHOLD) {
       setCandlesBlown(prev => Math.min(prev + 0.2, totalCandles));
    }
  };

  // Manual fallback for people with broken mics
  const manualBlow = () => {
      setCandlesBlown(prev => Math.min(prev + 1, totalCandles));
  };
  
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          stopMusic(); 
          setIsListening(false);
      }
  }, [candlesBlown]);

  return (
    <div className="cake-container center-screen">
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '600px', width: '95%'}}>
        <div className="title-bar">
            <span>🎂 HappyBirthday.exe</span>
            <div className="title-bar-controls"><div>_</div><div>□</div><div>X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#f0e6d2'}}>
            
            {!isListening && candlesBlown === 0 && (
                <div className="start-overlay">
                    <p>Ready to make a wish?</p>
                    <button className="retro-btn" onClick={startListening}>
                        Start Celebration 🎤
                    </button>
                </div>
            )}

            {Math.floor(candlesBlown) >= totalCandles ? (
                 <div className="wish-granted-msg">
                     <h2>✨ WISH GRANTED! ✨</h2>
                     <p>Scroll down to see your messages!</p>
                 </div>
            ) : (
            <>
                <div className={`cake ${isListening ? 'mic-active' : ''}`}>
                    <div className="plate"></div>
                    <div className="layer layer-bottom"></div>
                    <div className="layer layer-middle"></div>
                    <div className="layer layer-top"></div>
                    <div className="icing"></div>
                    
                    <div className="candles-container">
                        {[...Array(totalCandles)].map((_, i) => (
                        <div key={i} className="candle">
                            <div className={`flame ${i < Math.floor(candlesBlown) ? 'out' : ''}`}></div>
                            <div className="wick"></div>
                            <div className="wax"></div>
                        </div>
                        ))}
                    </div>
                </div>

                {isListening && (
                    <div className="controls">
                        <p className="instruction blink-text" style={{color: 'red'}}>
                            BLOW INTO MIC!
                        </p>
                        {/* THE BACKUP BUTTON */}
                        <button className="retro-btn" onClick={manualBlow} style={{fontSize: '0.8rem', marginTop: '10px'}}>
                            (Or click here to blow manually 🌬️)
                        </button>
                    </div>
                )}
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;