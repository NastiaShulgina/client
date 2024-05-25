import React from 'react';
import logo from './bird-purple.png';

const Header = () => {
    return (
        <div className="app-header-container">
            <header className="app-header">
                <div className="logo-container">
                    <img src={logo} alt="Hum&Sum Logo" />
                    <h1>Hum&Sum</h1>
                </div>
                <nav className="navigation">
                    <a href="#home">Home</a>
                    <a href="#history">My History</a>
                    <a href="#research">Research</a>
                </nav>
                <div className="auth-buttons">
                    <button className="login-btn">Log In</button>
                    <button className="signup-btn">Sign Up</button>
                </div>
            </header>
        </div>
    );
}

export default Header;
