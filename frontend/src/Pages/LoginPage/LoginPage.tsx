import React from 'react';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  
  return(
    <div className="login-wrapper background-tint">
      <div className="login-box">
        <h1 className="login-title">TK Fitness</h1>
        <h2 className="welcome-message">Welcome!</h2>
        <form>
        <div className="form-group input-container">
          <input type="text" id="username" placeholder="Username" />
        </div>
        <div className="form-group input-container">
          <input type="password" id="password" placeholder="Password" />
        </div>
          <div className="form-group center">
            <button className="submit-button" onClick={() => navigate('/dashboard')}>Log in</button>
          </div>
        </form>
      </div>
    </div>
  );
}