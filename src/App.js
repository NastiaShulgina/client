import React from 'react';
import './App.css';
import AudioRecorder from './components/AudioRecorder';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <AudioRecorder />
      <Footer />
    </div>
  );
}

export default App;