import React from 'react';
import '../styles/HandwrittenLetter.css';

const HandwrittenLetter = () => {
  return (
    <div className="letter-container center-screen">
      <div className="y2k-window notepad-window">
        <div className="title-bar">
            <span>📝 read_me.txt - Notepad</span>
            <div className="title-bar-controls"><div>_</div><div>□</div><div>X</div></div>
        </div>
        
        {/* Menu bar look */}
        <div className="notepad-menubar">
            <span>File</span><span>Edit</span><span>Search</span><span>Help</span>
        </div>

        <div className="window-content notepad-content">
            <p>Dearest [Birthday Person's Name],</p>
            <br/>
            <p>
                Happy Birthday! Welcome to your digital time capsule. 
                I hope this little corner of the internet brings a smile to your face.
            </p>
            <p>
                May this year be filled with as much joy, laughter, and 
                wonderful memories as you bring into the lives of everyone around you.
                You deserve all the happiness in the world.
            </p>
            <p>
                Keep shining bright!
            </p>
            <br/>
            <p style={{textAlign: 'right'}}>
                With love,<br/>
                [Your Name] 
            </p>
            <p className="cursor-blink">_</p>
        </div>
      </div>
    </div>
  );
};

export default HandwrittenLetter;