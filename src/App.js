import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Header from './components/Header';
import TranscriptDisplay from './components/TranscriptDisplay';
import AudioControls from './components/AudioControls';

const App = () => {
  const [transcript, setTranscript] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const { transcript: speechTranscript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (aiResponse) {
      generateAudio(aiResponse);
    }
  }, [aiResponse]);

  const handleListen = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  const handleStop = async () => {
    SpeechRecognition.stopListening();
    const userMessage = speechTranscript;
    setTranscript([...transcript, { role: 'user', content: userMessage }]);
    resetTranscript();

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a receptionist at a dental clinic. Your name is Mathangi. Be resourceful and efficient. Respond only in English.' },
        ...transcript,
        { role: 'user', content: userMessage }
      ]
    }, {
      headers: { 'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}` }
    });

    const aiMessage = response.data.choices[0].message.content;
    setTranscript([...transcript, { role: 'assistant', content: aiMessage }]);
    setAiResponse(aiMessage);
  };

  const generateAudio = async (text) => {
    const options = {
      method: 'POST',
      headers: {
        'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5,
          style: 1
        },
        model_id: 'eleven_turbo_v2'
      })
    };

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/sc0AglJOZet8qU247ItZ', options);
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error generating audio:', error);
    }
  };

  return (
    <div className="App">
      <Header />
      <TranscriptDisplay transcript={transcript} />
      <AudioControls onListen={handleListen} onStop={handleStop} />
    </div>
  );
};

export default App;
