import React, { useState } from 'react';
import '../styles/HandwrittenLetter.css';

const HandwrittenLetter = () => {
  const [isOpen, setIsOpen] = useState(false);

  // REPLACE THIS WITH YOUR PERSONAL MESSAGE
  const letterContent = `Dear [Friend's Name],

Happy Birthday to someone incredibly special! 🎉

As I sit here writing this, I can't help but smile thinking about all the amazing memories we've shared. From our late-night conversations to our spontaneous adventures, every moment with you has been a treasure.

You have this incredible ability to light up any room you walk into. Your kindness, your laughter, and your genuine spirit make the world a better place. I'm so grateful to have you in my life.

On this special day, I want you to know how much you mean to me. You're not just a friend – you're family. Thank you for being YOU, for always being there, and for making life so much more fun.

Here's to another year of incredible adventures, belly laughs, and memories that'll last forever!

May all your wishes come true! 🌟

With all my love,
[Your Name]

P.S. - I hope you loved the cake! 😄`;

  return (
    <div className="letter-container">
      <h1 className="letter-title">💌 A Special Letter for You 💌</h1>
      
      {!isOpen ? (
        <div className="envelope" onClick={() => setIsOpen(true)}>
          <div className="envelope-flap"></div>
          <div className="envelope-body">
            <p className="envelope-text">Click to Open</p>
          </div>
        </div>
      ) : (
        <div className="letter-content">
          <div className="paper">
            <div className="handwritten">
              {letterContent.split('\n').map((line, idx) => (
                <p key={idx} style={{ animationDelay: `${idx * 0.1}s` }}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="close-letter">
            📩 Close Letter
          </button>
        </div>
      )}
    </div>
  );
};

export default HandwrittenLetter;
