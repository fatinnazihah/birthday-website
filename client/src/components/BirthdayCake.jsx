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
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5;
          audioPlayerRef.current.play().catch(e => console.log("Audio Error:", e));
      }

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      await audioContextRef.current.resume();

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
        }
      });
      
      setIsListening(true);

      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // Use TimeDomainData for better volume detection
      analyserRef.current.fftSize = 2048;
      const bufferLength = analyserRef.current.fftSize;
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
    
    // Get waveform data (volume) instead of frequency
    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = (dataArrayRef.current[i] - 128) / 128; // Normalize
      sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);
    const volume = rms * 100; // Scale up

    setMicLevel(Math.min(100, volume * 4)); // Visual sensitivity

    // THRESHOLD: 5 is usually a decent "blow" or loud noise
    if (volume > 5 && candlesBlown < totalCandles) {
       setCandlesBlown(prev => Math.min(prev + 0.1, totalCandles));
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
            <div className="title-text" style={{color:'white'}}>🎂 celebration.exe</div>
            <div className="title-controls"><div className="control-btn">X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#E0F7FA', minHeight:'250px'}}>
            
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

                <div className="pixel-cake">
                    <div className="candle-row">
                        {[...Array(totalCandles)].map((_, i) => (
                            <div key={i} className="pixel-candle">
                                {/* Only show flame if candle is NOT blown out */}
                                {i >= Math.floor(candlesBlown) && (
                                    <div className="pixel-flame"></div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="icing-layer"></div>
                    <div className="top-layer"></div>
                    <div className="middle-layer"></div>
                    <div className="bottom-layer"></div>
                </div>

                {isListening && (
                    <button onClick={manualBlow} style={{marginTop:'30px', background:'none', border:'none', textDecoration:'underline', cursor:'pointer', fontSize:'10px'}}>
                        (Mic broken? Click to blow)
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