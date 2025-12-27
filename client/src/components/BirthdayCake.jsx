import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = ({ onComplete }) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0); // Visualizer state
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioPlayerRef = useRef(null); 

  const totalCandles = 5; 

  useEffect(() => {
    return () => {
      if (audioContextRef.current) audioContextRef.current.close();
      stopMusic();
    };
  }, []);

  // --- AUDIO LOGIC ---
  const startMusic = () => {
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5;
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
      startMusic();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsListening(true);

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);
      detectBlow();
    } catch (err) {
      console.error("Mic Error:", err);
      alert("Microphone blocked? Use the manual button below!");
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current || !isListening) return;
    if (candlesBlown >= totalCandles) return;

    requestAnimationFrame(detectBlow);
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Calculate volume
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const average = sum / dataArrayRef.current.length;
    
    // Update visualizer (0 to 100 scale)
    setMicLevel(Math.min(100, average * 2)); 

    // Threshold detection
    const BLOW_THRESHOLD = 40; // Adjusted for frequency data
    if (average > BLOW_THRESHOLD) {
       setCandlesBlown(prev => Math.min(prev + 0.15, totalCandles));
    }
  };

  const manualBlow = () => {
      setCandlesBlown(prev => Math.min(prev + 1, totalCandles));
  };
  
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          stopMusic(); 
          setIsListening(false);
          // Notify parent that we are done!
          if (onComplete) onComplete();
      }
  }, [candlesBlown, onComplete, totalCandles]);

  return (
    <div className="cake-wrapper">
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '500px', margin: '0 auto'}}>
        <div className="title-bar active">
            <div className="title-text">🎂 celebration_setup.exe</div>
            <div className="title-controls"><div className="control-box">_</div><div className="control-box">X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#E0F7FA'}}>
            
            {!isListening && candlesBlown === 0 && (
                <div style={{padding: '20px'}}>
                    <h3>Are you ready?</h3>
                    <button className="retro-btn" onClick={startListening}>
                        Start Party 🎤
                    </button>
                </div>
            )}

            {Math.floor(candlesBlown) >= totalCandles ? (
                 <div className="success-message">
                     <h2 style={{color: 'green'}}>✨ WISH GRANTED! ✨</h2>
                     <p>Unlocking surprises...</p>
                 </div>
            ) : (
            <div style={{display: isListening || candlesBlown > 0 ? 'block' : 'none'}}>
                {/* MIC VISUALIZER */}
                {isListening && (
                    <div className="mic-meter-container">
                        <div className="mic-meter-fill" style={{width: `${micLevel}%`}}></div>
                        <span className="mic-label">MIC INPUT</span>
                    </div>
                )}

                {/* THE CAKE */}
                <div className="cake-container">
                    <div className="cake-body">
                        <div className="cake-layer bottom"></div>
                        <div className="cake-layer middle"></div>
                        <div className="cake-layer top"></div>
                        <div className="cake-frosting"></div>
                        <div className="candles-row">
                            {[...Array(totalCandles)].map((_, i) => (
                                <div key={i} className="candle">
                                    <div className={`flame ${i < Math.floor(candlesBlown) ? 'out' : ''}`}></div>
                                    <div className="wax"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isListening && (
                    <div style={{marginTop: '20px'}}>
                         <p className="blink-text" style={{color: 'red'}}>BLOW INTO THE MIC!</p>
                         <button onClick={manualBlow} style={{fontSize: '10px', background:'transparent', border:'none', textDecoration:'underline', cursor:'pointer'}}>
                            (Mic broken? Click to blow)
                         </button>
                    </div>
                )}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;