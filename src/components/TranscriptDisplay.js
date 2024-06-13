import React from 'react';

const TranscriptDisplay = ({ transcript }) => (
  <div>
    {transcript.map((entry, index) => (
      <p key={index}><strong>{entry.role}:</strong> {entry.content}</p>
    ))}
  </div>
);

export default TranscriptDisplay;
