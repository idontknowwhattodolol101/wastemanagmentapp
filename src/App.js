import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import WasteManager from './WasteManager';
import backgroundImage from './background.png'; // Background image
import logo from './logo.png'; // Logo image

Amplify.configure(awsExports);

// Custom Theme for Authenticator with eco-friendly styling
const theme = {
  name: 'smart-waste-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#e8f5e9' }, // Very light green background
        secondary: { value: '#4a8d5f' }, // Dark green for headers and buttons
      },
      font: {
        primary: { value: '#2d5a34' }, // Dark green text
        secondary: { value: '#555' },   // Secondary font color
      },
      border: {
        primary: { value: '#4CAF50' },  // Green for button borders and inputs
      },
      brand: {
        primary: { value: '#4CAF50' },  // Green brand color for buttons
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
          backgroundColor: { value: '#388e3c' }, // Darker green on hover
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
        <Authenticator hideSignUp>
          {({ signOut }) => (
            <main>
              <header className="App-header">
                <img src={logo} alt="Smart Waste Logo" className="logo" />
                <h1 className="title">WasteWise</h1>
                <p className="subtitle">'one click closer to a greener tomorrow'</p>
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
              </header>
            </main>
          )}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}

export default App;
