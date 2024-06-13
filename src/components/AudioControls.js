import React from 'react';

const AudioControls = ({ onListen, onStop }) => (
  <div>
    <button onClick={onListen}>Listen</button>
    <button onClick={onStop}>Stop</button>
  </div>
);

export default AudioControls;
