import React, { useState } from 'react';
import axios from 'axios';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
            /*
            const response = await axios.post('http://localhost:5001/recognize', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            **/
            const response = await axios.post('http://127.0.0.1:5001/recognize', formData);


            console.log(response);

            if (response.data.status && response.data.status.code === 0) {
                const title = response.data.metadata.music[0].title;
                const artists = response.data.metadata.music[0].artists.map(artist => artist.name).join(", ");
                alert(`Song recognized: ${title} by ${artists}`);
            } else {
                alert('No matches found.');
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            alert('Error recognizing the song.');
        }
    };

    const startRecording = async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Browser API navigator.mediaDevices.getUserMedia not available');
            return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newMediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        newMediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioURL(audioUrl);
            sendAudioToServer(audioBlob);
        };

        newMediaRecorder.start();
        setRecording(true);
        setMediaRecorder(newMediaRecorder);

        setTimeout(() => {
            newMediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
            setRecording(false);
        }, 10000); // Adjust as needed 
    };

    return (
        <div>
            <p>{recording ? 'Recording in progress...' : 'Click to start recording'}</p>
            <button onClick={startRecording} disabled={recording}>
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && <audio src={audioURL} controls />}
        </div>
    );
};

export default AudioRecorder;