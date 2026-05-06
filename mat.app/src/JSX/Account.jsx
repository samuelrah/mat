import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated - for demo, check localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated || !user) {
    return null; // Will redirect, show nothing while redirecting
  } 
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="mb-4">
                        <h2>Account</h2>
                        <p>Manage your profile, view purchase history, and check your points.</p>
                    </div>

                    <div className="card mb-3 bg-dark border-secondary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Points</h5>
                            <p className="card-text display-6">{user.points} kr</p>
                            <p className="card-text text-muted">Current reward points balance</p>
                        </div>
                    </div>

                    <div className="card mb-3 bg-dark border-secondary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Settings</h5>
                            <div className="mb-2">
                                <strong>Name:</strong>
                                <div>{user.name}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Email:</strong>
                                <div>{user.email}</div>
                            </div>
                            <div className="mb-2">
                                <strong>Password:</strong>
                                <div>••••••••</div>
                            </div>
                            <div>
                                <strong>Location:</strong>
                                <div>Stockholm, Sweden</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-dark border-secondary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Purchase History</h5>
                            <ul className="list-unstyled mb-0">
                                <li>Order #1024 - 2026-04-20 - 89 kr</li>
                                <li>Order #1017 - 2026-03-18 - 45 kr</li>
                                <li>Order #1006 - 2026-02-10 - 120 kr</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button 
                            className="btn btn-outline-danger"
                            onClick={() => {
                                localStorage.removeItem('user');
                                navigate('/login');
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

}