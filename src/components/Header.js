import React from 'react';
import { FileText, User, LogIn, LogOut } from 'lucide-react';
import '../styles/NotesApp.css';

const Header = ({ onShowLogin, onShowRegister, user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <FileText size={24} />
          Catatanku
        </div>
        
        <div className="auth-section">
          {user ? (
            <div className="user-section">
              <div className="user-info">
                <User size={18} />
                <span className="username">{user.username}</span>
              </div>
              <button 
                className="auth-button logout-button" 
                onClick={onLogout}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="auth-button login-button" 
                onClick={onShowLogin}
              >
                <LogIn size={16} />
                Login
              </button>
              <button 
                className="auth-button register-button" 
                onClick={onShowRegister}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;