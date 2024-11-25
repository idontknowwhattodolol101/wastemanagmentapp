import React, { useState } from 'react';
import './App.css';
import { Amplify, Auth } from 'aws-amplify';
import { Authenticator, ThemeProvider, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import WasteManager from './WasteManager';
import backgroundImage from './background.png'; 
import logo from './logo.png'; 

Amplify.configure(awsExports);

const theme = {
  name: 'smart-waste-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#e8f5e9' }, 
        secondary: { value: '#4a8d5f' }, 
      },
      font: {
        primary: { value: '#2d5a34' }, 
        secondary: { value: '#555' },   
      },
      border: {
        primary: { value: '#4CAF50' }, 
      },
      brand: {
        primary: { value: '#4CAF50' }, 
      },
    },
    components: {
      card: {
        backgroundColor: { value: 'white' },
        borderRadius: { value: '15px' },
        boxShadow: { value: '0 4px 10px rgba(0, 0, 0, 0.15)' },
        padding: { value: '25px' },
        maxWidth: { value: '400px' },
        margin: { value: '0 auto' },
      },
      button: {
        borderRadius: { value: '20px' },
        padding: { value: '12px 24px' },
        fontSize: { value: '1rem' },
        _hover: {
          backgroundColor: { value: '#388e3c' },
        },
      },
      input: {
        borderRadius: { value: '10px' },
        padding: { value: '12px 15px' },
        fontSize: { value: '1rem' },
        _focus: {
          borderColor: { value: '#4CAF50' },
        },
      },
    },
  },
};

function App() {
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignIn = async (username, password) => {
    setErrorMessage('');
    try {
      await Auth.signIn(username, password);
    } catch (error) {
      if (error.code === 'UserNotFoundException') {
        setErrorMessage('User does not exist. Would you like to sign up?');
        setShowSignUp(true);
      } else if (error.code === 'NotAuthorizedException') {
        setErrorMessage('Incorrect username or password. Please try again.');
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    }
  };

  const handleSignUpRedirect = () => {
    setShowSignUp(false);
    window.location.href = '/signup';
  };

  return (
    <ThemeProvider theme={theme}>
      <div 
        className="App"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Authenticator hideSignUp={true}>
          {({ signOut, user }) => (
            <main>
              <header className="App-header">
                <img src={logo} alt="Smart Waste Logo" className="logo" />
                <h1 className="title">WasteWise</h1>
                <p className="subtitle">'one click closer to a greener tomorrow'</p>

                {!user ? (
                  <div className="auth-container">
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {showSignUp && (
                      <button 
                        className="redirect-signup-button" 
                        onClick={handleSignUpRedirect}
                      >
                        Sign Up
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <WasteManager />
                    <button 
                      onClick={signOut} 
                      style={{ 
                        margin: '20px', 
                        fontSize: '0.8rem', 
                        padding: '5px 10px', 
                        marginTop: '20px'
                      }}
                    >
                      Sign Out
                    </button>
                  </>
                )}
              </header>
            </main>
          )}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}

export default App;
