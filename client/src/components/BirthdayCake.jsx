import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = () => {
  const [candlesBlown, setCandlesBlown] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  // Audio Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const audioPlayerRef = useRef(null); // Ref for the MP3 player

  const totalCandles = 5; // Adjust as needed

  useEffect(() => {
    // Cleanup audio context on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      stopMusic();
    };
  }, []);

  const startMusic = () => {
      if(audioPlayerRef.current) {
          audioPlayerRef.current.volume = 0.5; // Set initial volume
          audioPlayerRef.current.play().catch(e => console.log("Playback failed:", e));
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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
      setIsListening(true);
      
      // Start the birthday music!
      startMusic();

      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      // fftSize determines sample size for analysis. Higher = more precise data.
      analyserRef.current.fftSize = 512; 
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      sourceRef.current.connect(analyserRef.current);
      detectBlow();

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please enable microphone access to blow out the candles!");
      setMicPermission(false);
    }
  };

  // The heart of the detection logic
  const detectBlow = () => {
    if (!analyserRef.current || !isListening) return;

    requestAnimationFrame(detectBlow);

    analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

    // Calculate RMS (Root Mean Square) - average volume level
    let sum = 0;
    for (let i = 0; i < dataArrayRef.current.length; i++) {
      const value = (dataArrayRef.current[i] - 128) / 128; // Normalize to -1 to 1
      sum += value * value;
    }
    const rms = Math.sqrt(sum / dataArrayRef.current.length);

    // THRESHOLD: Adjust this value. 0.05 is a loud breath close to mic.
    // If it's too hard, lower it (e.g., 0.03). If ambient noise triggers it, raise it.
    const BLOW_THRESHOLD = 0.08; 

    if (rms > BLOW_THRESHOLD && candlesBlown < totalCandles) {
       // Increase blown count slowly so they don't all go out at once
       setCandlesBlown(prev => Math.min(prev + 0.1, totalCandles));
    }
  };
  
  // Check if all out
  useEffect(() => {
      if(Math.floor(candlesBlown) >= totalCandles) {
          stopMusic(); // Stop music when finished
      }
  }, [candlesBlown]);


  return (
    <div className="cake-container center-screen">
      {/* Hidden Audio Player */}
      <audio ref={audioPlayerRef} src="/birthday-song.mp3" loop playsInline />

      <div className="y2k-window" style={{maxWidth: '600px', width: '100%'}}>
        <div className="title-bar">
            <span>🎂 HappyBirthday.exe</span>
            <div className="title-bar-controls"><div>_</div><div>□</div><div>X</div></div>
        </div>
        <div className="window-content" style={{textAlign: 'center', background: '#f0e6d2'}}>
            
            {!micPermission && !isListening && (
                <div className="start-overlay">
                    <p>Ready to make a wish?</p>
                    <button className="retro-btn" onClick={startListening}>
                        Start & Enable Mic 🎤
                    </button>
                </div>
            )}

            {Math.floor(candlesBlown) >= totalCandles ? (
                 <div className="wish-granted-msg">
                     <h2>✨ WISH GRANTED! ✨</h2>
                     <p>Scroll down to see your messages!</p>
                 </div>
            ) : (
            <div className={`cake ${isListening ? 'mic-active' : ''}`}>
                <div className="plate"></div>
                <div className="layer layer-bottom"></div>
                <div className="layer layer-middle"></div>
                <div className="layer layer-top"></div>
                <div className="icing"></div>
                
                <div className="candles-container">
                    {[...Array(totalCandles)].map((_, i) => (
                    <div key={i} className="candle">
                        {/* Only show flame if index is higher than current blown count */}
                        <div className={`flame ${i < Math.floor(candlesBlown) ? 'out' : ''}`}></div>
                        <div className="wick"></div>
                        <div className="wax"></div>
                    </div>
                    ))}
                </div>
            </div>
            )}

            {isListening && Math.floor(candlesBlown) < totalCandles && (
                 <p className="instruction blink-text" style={{color: 'red', marginTop:'20px'}}>
                    BLOW INTO YOUR MICROPHONE!
                 </p>
            )}

        </div>
      </div>
    </div>
  );
};

export default BirthdayCake;