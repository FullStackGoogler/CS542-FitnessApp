import React from 'react';
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form>
        <label>
          <p>Username</p>
          <input type="text" />
        </label>
        <label>
          <p>Password</p>
          <input type="password" />
        </label>
        <div>
          <button onClick={() => navigate('/dashboard')}>Submit</button>
        </div>
      </form>
    </div>
  )
}