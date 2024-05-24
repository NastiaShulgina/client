import React from 'react';
import logo from './bird.png';

const Header = () => {
    return (
        <header className="app-header">
            <div className="logo-container">
                <img src={logo} alt="Hum&Sum Logo" />
                <h1>Hum&Sum</h1>
            </div>
            <nav className="navigation">
                <a href="#research">Research</a>
                <a href="#history">My History</a>
                <a href="#trends">Current Trends</a>
            </nav>
            <div className="auth-buttons">
                <button className="login-btn">Log In</button>
                <button className="signup-btn">Sign Up</button>
            </div>
        </header>
    );
}

export default Header;
