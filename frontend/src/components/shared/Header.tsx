import React from 'react';

const Header: React.FC = () => {
    return (
        <header>
            <h1>Rust Blackjack</h1>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/lobby">Lobby</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/register">Register</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;