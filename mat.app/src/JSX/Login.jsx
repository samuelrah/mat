import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Admin email list for authorization
  const adminEmails = ['admin@emberandoak.com', 'dedu@example.com'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const username = e.target.username?.value || '';
    const firstName = e.target.firstName?.value || '';
    const lastName = e.target.lastName?.value || '';

    const userData = {
      email,
      username,
      firstName,
      lastName,
      name: isSignUp ? `${firstName} ${lastName}`.trim() || email.split('@')[0] : email.split('@')[0] || 'Existing User',
      points: 5,
      isAdmin: adminEmails.includes(email.toLowerCase()),
    };
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/account');
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-header">
          <h1>Ember and Oak</h1>
        </div>
        <div className="login-container">
          <div className="login-box">
            <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
            
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <>
                  <div className="form-group">
                    <input
                      name="username"
                      type="text"
                      placeholder="Username"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="name-row">
                    <div className="form-group">
                      <input
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      name="email"
                      type="email" 
                      placeholder="Email" 
                      className="form-control"
                      required 
                    
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="password"
                      type="password" 
                      placeholder="Password" 
                      className="form-control"
                      required 
                    />
                  </div>
                </>
              )}
              <div className="form-group">
                <input 
                  name="email"
                  type="email" 
                  placeholder="Email" 
                  className="form-control"
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  name="password"
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
    </div>
    </div>
  );
}
