import React, { useState } from 'react';
import axios from 'axios';
import humming from './simpsons-humming.gif';
import stuck from './stuck-in-head.gif';

const AudioRecorder = () => {
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [songDetails, setSongDetails] = useState(false);
    const [songTitle, setSongTitle] = useState('');
    const [songArtist, setSongArtist] = useState('');
    const [error, setError] = useState('');
    const [spotifyDetails, setSpotifyDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, { filename: 'audio_file' });

        try {
            const response = await axios.post('http://127.0.0.1:5001/recognize', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.metadata && response.data.metadata.humming && response.data.metadata.humming.length > 0) {
                const topTrack = response.data.metadata.humming[0];
                console.log(topTrack);
                const title = topTrack.title;
                const artist = topTrack.artists.map(artist => artist.name).join(", ");
                setSongDetails(true);
                setSongTitle(`${title}`);
                setSongArtist(`${artist}`);
                searchSongOnSpotify(title);
            } else {
                setSongDetails('No matches found.');
            }
        } catch (error) {
            console.error('Error sending audio:', error);
            setError('Error recognizing the song.');
        }
    };

    const searchSongOnSpotify = async (title, artist) => {
        try {
            const spotifyResponse = await axios.get(`http://127.0.0.1:5001/spotify-search`, {
                params: { title, artist }
            });

            if (spotifyResponse.data) {
                console.log('Spotify Data:', spotifyResponse.data);
                const trackId = spotifyResponse.data.id;
                console.log(trackId);
                const features = await getSpotifyTrackFeatures(trackId);
                setSpotifyDetails({
                    danceability: features.danceability,
                    energy: features.energy,
                    key: convertToKey(features.key),
                    tempo: features.tempo
                });
                console.log(features);
                setError('');
            } else {
                setSpotifyDetails({});
                setError('Spotify song details not found.');
            }
        } catch (error) {
            console.error('Error searching on Spotify:', error);
            setSpotifyDetails({});
            setError(`Error: failed to fetch the song's metrics.`);
        }
    };

    const getSpotifyTrackFeatures = async (trackId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5001/spotify-track-features/${trackId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching track features:', error);
            setError('Error: failed to fetch track metrics.');
            return {};
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

    function convertToKey(response) {
        if (response === 0) {
            return 'C';
        } if (response === 1) {
            return 'C#';
        } if (response === 2) {
            return 'D';
        } if (response === 3) {
            return 'D#';
        } if (response === 4) {
            return 'E';
        } if (response === 5) {
            return 'F';
        } if (response === 6) {
            return 'F#';
        } if (response === 7) {
            return 'G';
        } if (response === 8) {
            return 'G#';
        } if (response === 9) {
            return 'A';
        } if (response === 10) {
            return 'A#';
        } if (response === 11) {
            return 'B';
        } else {
            return '(pitch unknown)';
        }
    }

    return (
        <div className="main-content">
            <div>
                <h1>Recognize a song by humming &#129304;</h1>
                <img src={recording ? humming : stuck} alt={recording ? "Recording in progress" : "Not recording"} className="gif" />
                <h3 className="helper">{recording ? 'Recording in progress...' : 'Click to record yourself'} &#128071;</h3>
                <button
                    onClick={startRecording}
                    disabled={recording || loading}
                    className={recording ? 'recording' : 'start-recording'}
                >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {/* {audioURL && <audio src={audioURL} controls />} */}
                {loading && <p>Loading...</p>}
                {songDetails && (
                    <div className="song-card">
                        <p>&#128077; Song recognized:</p>
                        <div className="song-details">
                            <h2 className="song-title">{songTitle}</h2>
                            <p className="song-prefix">by</p>
                            <h2 className="song-artist">{songArtist}</h2>
                        </div>
                    </div>
                )}
                {Object.keys(spotifyDetails).length > 0 && (
                    <div className="features-container">
                        <div className="feature-card">
                            <p>Danceability:</p>
                            <h4>{Math.round(spotifyDetails.danceability * 100)}%</h4>
                        </div>
                        <div className="feature-card">
                            <p>Energy:</p>
                            <h4>{Math.round(spotifyDetails.energy * 100)}%</h4>
                        </div>
                        <div className="feature-card">
                            <p>Key:</p>
                            <h4>{spotifyDetails.key}</h4>
                        </div>
                        <div className="feature-card">
                            <p>Tempo:</p>
                            <h4>{Math.round(spotifyDetails.tempo)} BPM</h4>
                        </div>
                    </div>
                )}
                {error && <h4 className="error-message">&#10071;{error}</h4>}
            </div>
        </div>
    );
};

export default AudioRecorder;