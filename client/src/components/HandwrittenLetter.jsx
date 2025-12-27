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
            <p>Dearest Sonia,</p>
            <br/>
            <p>
                Happy Birthday! Welcome to your digital birthday party! 
                I hope this little corner of the internet brings a smile to your face. I can't be with you in person, but I wanted to create something special to celebrate you on your big day.
            </p>
            <p>
                I get to know you more this year, and I'm so grateful for the memories we've created together. 
                We bonded through our hardships but that's what makes it special kann HAHAHAH. 
                You never fail to show kindness and I want you to know how much I appreciate you.
                Thank you for being by me and do know that I'm always here for you too.
            </p>
            <p>
                Semoga Sonia kaya raya, graduate with good cgpa, dapat dream job, dapat beli your dream car, travel the world, jumpa jodoh baik and may we all stay kind, and get kindness back! Happy birthday Sonia!!!
            </p>
            <br/>
            <p style={{textAlign: 'right'}}>
                With love,<br/>
                aten :P 
            </p>
            <p className="cursor-blink">_</p>
        </div>
      </div>
    </div>
  );
};

export default HandwrittenLetter;