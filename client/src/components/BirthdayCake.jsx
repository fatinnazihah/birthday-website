import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = ({ onComplete }) => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioPlayerRef = useRef(null); 
  const animationFrameRef = useRef(null);

  const totalCandles = 5; 

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const startCelebration = async () => {
    try {
      // 1. Play Music
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5;
          audioPlayerRef.current.play().catch(e => console.log("Audio Error:", e));
      }

      // 2. Setup Mic with aggressive settings
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      await audioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: false, // Turn off filters to hear "wind"
            noiseSuppression: false,
            autoGainControl: false
        }
      });
      
      setIsListening(true);

      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);
      detectSound();
    } catch (err) {
      alert("Microphone failed. Use the manual button!");
    }
  };

  const detectSound = () => {
    if (!analyserRef.current || !isListening) return;

    animationFrameRef.current = requestAnimationFrame(detectSound);
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Calculate total volume (loudness)
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      sum += dataArrayRef.current[i];
    }
    const average = sum / dataArrayRef.current.length;
    
    // Update visualizer (multiply to make it look sensitive)
    setMicLevel(Math.min(100, average * 2)); 

    // SUPER SENSITIVE THRESHOLD:
    // If average volume is above 10 (very quiet), count it as a blow
    if (average > 10 && candlesBlown < totalCandles) {
       setCandlesBlown(prev => Math.min(prev + 0.05, totalCandles));
    }
  };

  const manualBlow = () => {
      setCandlesBlown(prev => Math.min(prev + 1, totalCandles));
  };
  
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          setIsListening(false);
          if(audioPlayerRef.current) {
             audioPlayerRef.current.pause();
             audioPlayerRef.current.currentTime = 0;
          }
          if (onComplete) onComplete();
      }
  }, [candlesBlown, totalCandles]); 

  return (
    <div className="cake-wrapper">
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '400px', margin: '0 auto'}}>
        <div className="title-bar">
            <div className="title-text">🎂 celebration.exe</div>
            <div className="title-controls"><div className="control-btn">X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#E0F7FA'}}>
            
            {!isListening && candlesBlown === 0 && (
                <div style={{padding: '20px'}}>
                    <p style={{fontFamily: 'sans-serif', marginBottom: '10px'}}>Make a wish & blow!</p>
                    <button className="retro-btn" onClick={startCelebration}>
                        Start Party 🎤
                    </button>
                </div>
            )}

            {Math.floor(candlesBlown) >= totalCandles ? (
                 <div className="success-message">
                     <h2 style={{color: 'green', textShadow: '2px 2px 0 #fff'}}>✨ WISH GRANTED! ✨</h2>
                     <p>UNLOCKING...</p>
                 </div>
            ) : (
            <div style={{display: isListening || candlesBlown > 0 ? 'block' : 'none'}}>
                {isListening && (
                    <div className="mic-meter-container">
                        <div className="mic-meter-fill" style={{width: `${micLevel}%`}}></div>
                    </div>
                )}

                {/* NEW PIXEL ART STYLE CAKE */}
                <div className="pixel-cake">
                    <div className="candle-row">
                        {[...Array(totalCandles)].map((_, i) => (
                            <div key={i} className="pixel-candle">
                                <div className={`pixel-flame ${i < Math.floor(candlesBlown) ? 'out' : ''}`}></div>
                            </div>
                        ))}
                    </div>
                    <div className="icing-layer"></div>
                    <div className="top-layer"></div>
                    <div className="middle-layer"></div>
                    <div className="bottom-layer"></div>
                </div>

                {isListening && (
                    <button onClick={manualBlow} style={{marginTop:'15px', background:'none', border:'none', textDecoration:'underline', cursor:'pointer', fontSize:'10px'}}>
                        (Click here if mic is broken)
                    </button>
                )}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;