import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login/signup - in real app would validate credentials
    // For now, just redirect to account after "successful" auth
    navigate('/account');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="form-control"
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="form-control"
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="toggle-mode">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              className="btn-link"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? ' Sign In' : ' Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}