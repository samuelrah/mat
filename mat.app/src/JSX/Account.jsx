import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() { 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated - for demo, check localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      // Redirect to login if not authenticated
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditData(parsedUser);
      setIsAuthenticated(true);
    }
  }, [navigate]);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditMode(false);
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect, show nothing while redirecting
  } 
    return (
        <div style={{ minHeight: "100vh", paddingTop: "80px" }}>
          <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8">
                    <div className="card bg-dark border-secondary text-white">
                        <div className="card-body">
                            <div className="mb-4">
                                <h2>Account</h2>
                                <p>Manage your profile, view purchase history and check your points.</p>
                            </div>

                            <div className="mb-4">
                                <h5 className="card-title">Points</h5>
                                <p className="card-text display-6">{user.points} kr</p>
                                <p className="card-text text-muted">Current reward points balance</p>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="card-title mb-0">Settings</h5>
                                    {!isEditMode && (
                                        <button 
                                            className="btn btn-sm btn-outline-warning"
                                            onClick={handleEdit}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                                
                                {isEditMode ? (
                                    <>
                                        <div className="mb-3">
                                            <label className="form-label">Name:</label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm bg-secondary text-white border-secondary"
                                                value={editData.name || ''}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email:</label>
                                            <input 
                                                type="email" 
                                                className="form-control form-control-sm bg-secondary text-white border-secondary"
                                                value={editData.email || ''}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Address:</label>
                                            <input 
                                                type="text" 
                                                className="form-control form-control-sm bg-secondary text-white border-secondary"
                                                value={editData.address || ''}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phone:</label>
                                            <input 
                                                type="tel" 
                                                className="form-control form-control-sm bg-secondary text-white border-secondary"
                                                value={editData.phone || ''}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                            />
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button 
                                                className="btn btn-sm"
                                                style={{ backgroundColor: '#ff9800', color: '#111', border: 'none' }}
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-secondary"
                                                onClick={handleCancel}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-2">
                                            <strong>Name:</strong>
                                            <div>{user.name}</div>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Email:</strong>
                                            <div>{user.email}</div>
                                        </div>
                                        <div className="mb-2">
                                            <strong>Address:</strong>
                                            <div>{user.address || 'Stockholm, Sweden'}</div>
                                        </div>
                                        <div>
                                            <strong>Phone:</strong>
                                            <div>{user.phone || 'Not provided'}</div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mb-4">
                                <h5 className="card-title">Purchase History</h5>
                                <ul className="list-unstyled mb-0">
                                    <li>Order #1024 - 2026-04-20 - 89 kr</li>
                                    <li>Order #1017 - 2026-03-18 - 45 kr</li>
                                    <li>Order #1006 - 2026-02-10 - 120 kr</li>
                                </ul>
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
            </div>
        </div>
    </div>
    );

}