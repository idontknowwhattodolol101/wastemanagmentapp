import React, { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSignUp = async () => {
    setErrorMessage('');
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      history.push('/'); // Redirect back to the main page after sign-up
    } catch (error) {
      setErrorMessage(error.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <div className="form-group">
        <label>Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default Signup;
