import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Handle signup
        const username = e.target.username.value;
        const firstName = e.target.firstName.value;
        const lastName = e.target.lastName.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const address = e.target.address.value;
        const phone = e.target.phone.value || '';

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: username,
            firstName,
            lastName,
            userMail: email,
            password,
            userAdress: address,
            phoneNum: phone,
            user_is_premium: false,
            user_is_admin: false,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Sign up failed');
        }

        const newUser = await response.json();
        const userData = {
          userName: newUser.userName,
          email: newUser.userMail,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          name: `${newUser.firstName} ${newUser.lastName}`,
          points: 5,
          isAdmin: newUser.user_is_admin || false,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userLogin'));
        navigate('/');
      } else {
        // Handle login
        const username = e.target.username.value;
        const password = e.target.password.value;

        const response = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: username,
            password,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Login failed');
        }

        const user = await response.json();
        const userData = {
          userName: user.userName,
          email: user.userMail,
          firstName: user.firstName,
          lastName: user.lastName,
          name: `${user.firstName} ${user.lastName}`,
          points: 5,
          isAdmin: user.user_is_admin || false,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        window.dispatchEvent(new Event('userLogin'));
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
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
                  <div className="form-group">
                    <input
                      name="confirmPassword"
                      type="password" 
                      placeholder="Confirm Password" 
                      className="form-control"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="address"
                      type="text" 
                      placeholder="Address" 
                      className="form-control"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input
                      name="phone"
                      type="tel" 
                      placeholder="Phone Number" 
                      className="form-control"
                    />
                  </div>
                </>
              )}
              {!isSignUp && (
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
              {error && <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
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
