import React, { useState, useEffect, useRef } from 'react';
import '../styles/BirthdayCake.css';

const BirthdayCake = () => {
  const [candles, setCandles] = useState([true, true, true, true, true]);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphone.connect(analyserRef.current);
      
      setIsListening(true);
      detectBlow();
    } catch (err) {
      setMessage('⚠️ Please allow microphone access!');
    }
  };

  const detectBlow = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkAudio = () => {
      if (!isListening) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      // Detect blow (loud sound)
      if (average > 50) {
        blowOutCandle();
      }
      
      requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
  };

  const blowOutCandle = () => {
    const litCandles = candles.map((lit, idx) => lit ? idx : -1).filter(i => i !== -1);
    
    if (litCandles.length > 0) {
      const randomCandle = litCandles[Math.floor(Math.random() * litCandles.length)];
      const newCandles = [...candles];
      newCandles[randomCandle] = false;
      setCandles(newCandles);
      
      if (newCandles.every(c => !c)) {
        setMessage('🎊 All candles blown! Make a wish! 🎊');
        stopListening();
      }
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const resetCandles = () => {
    setCandles([true, true, true, true, true]);
    setMessage('');
    if (isListening) stopListening();
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  return (
    <div className="cake-container">
      <h1 className="cake-title">🎂 Blow Out Your Candles! 🎂</h1>
      
      <div className="cake">
        <div className="candles">
          {candles.map((isLit, idx) => (
            <div key={idx} className="candle">
              <div className={`flame ${isLit ? 'lit' : 'out'}`}>🔥</div>
              <div className="wick"></div>
              <div className="candle-body"></div>
            </div>
          ))}
        </div>
        
        <div className="cake-layer layer-1">
          <div className="frosting"></div>
        </div>
        <div className="cake-layer layer-2">
          <div className="frosting"></div>
        </div>
        <div className="cake-layer layer-3"></div>
      </div>

      <div className="controls">
        {!isListening ? (
          <button onClick={startListening} className="blow-btn">
            🎤 Start Blowing!
          </button>
        ) : (
          <button onClick={stopListening} className="stop-btn">
            ⏸️ Stop
          </button>
        )}
        <button onClick={resetCandles} className="reset-btn">
          🔄 Reset Candles
        </button>
      </div>

      {message && <p className="success-message">{message}</p>}
      
      <p className="instruction">
        {isListening ? '🎤 Blow into your microphone!' : '👆 Click "Start Blowing" and blow!'}
      </p>
    </div>
  );
};

export default BirthdayCake;
