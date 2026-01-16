import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import Header from './components/shared/Header';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/lobby" component={LobbyPage} />
          <Route path="/game/:gameId" component={GamePage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;