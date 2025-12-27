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
      stopMusic();
    };
  }, []);

  const startMusic = () => {
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5;
          audioPlayerRef.current.play().catch(e => console.log("Audio Error:", e));
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
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      startMusic();

      // THE MAGIC FIX: Disable "smart" audio filters so we can hear the wind/blowing!
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
      
      analyserRef.current.fftSize = 512;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);
      detectBlow();
    } catch (err) {
      console.error("Mic Error:", err);
      alert("Microphone failed. Please use the manual button below!");
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current || !isListening) return;

    animationFrameRef.current = requestAnimationFrame(detectBlow);
    analyserRef.current.getByteFrequencyData(dataArrayRef.current);

    // Blowing produces low-frequency noise. We focus on that.
    const lowerFrequencies = dataArrayRef.current.slice(0, 15); // Focus on bass/wind
    let sum = 0;
    for (let i = 0; i < lowerFrequencies.length; i++) {
      sum += lowerFrequencies[i];
    }
    const average = sum / lowerFrequencies.length;
    
    // Update visualizer
    setMicLevel(Math.min(100, average * 1.5)); 

    // Threshold: If volume of low freq is high, it's a blow
    if (average > 40 && candlesBlown < totalCandles) {
       setCandlesBlown(prev => Math.min(prev + 0.1, totalCandles));
    }
  };

  const manualBlow = () => {
      setCandlesBlown(prev => Math.min(prev + 1, totalCandles));
  };
  
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          stopMusic(); 
          setIsListening(false);
          cancelAnimationFrame(animationFrameRef.current);
          if (onComplete) onComplete();
      }
  }, [candlesBlown, totalCandles]); 

  return (
    <div className="cake-wrapper">
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '500px', margin: '0 auto'}}>
        <div className="title-bar">
            <div className="title-text">🎂 celebration_setup.exe</div>
            <div className="title-controls"><div className="control-btn">X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#E0F7FA'}}>
            
            {!isListening && candlesBlown === 0 && (
                <div style={{padding: '30px'}}>
                    <h3>Ready to Celebrate?</h3>
                    <p>Make sure your sound is ON!</p>
                    <br/>
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
                {isListening && (
                    <div className="mic-meter-container">
                        <div className="mic-meter-fill" style={{width: `${micLevel}%`}}></div>
                        <span className="mic-label">BLOW STRENGTH</span>
                    </div>
                )}

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
                         <button onClick={manualBlow} style={{fontSize: '12px', background:'transparent', border:'none', textDecoration:'underline', cursor:'pointer'}}>
                            (Alternative: Click here to blow)
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