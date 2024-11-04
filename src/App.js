import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import WasteManager from './WasteManager';

// Configure AWS Amplify
Amplify.configure(awsExports);

// Custom Theme for Authenticator
const theme = {
  name: 'custom-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#f3f9f1' }, // Light green background
        secondary: { value: '#4a8d5f' }, // Dark green header color
      },
      font: {
        primary: { value: '#2d5a34' }, // Dark green font for headings
        secondary: { value: '#555' },   // Secondary font color for body text
      },
      border: {
        primary: { value: '#4CAF50' },  // Green for button borders
      },
      brand: {
        primary: { value: '#4CAF50' },  // Green for buttons and highlights
      },
    },
    components: {
      button: {
        borderRadius: { value: '8px' },
        padding: { value: '12px 24px' },
        fontSize: { value: '1rem' },
        _hover: {
          backgroundColor: { value: '#45a049' }, // Darker green on hover
        },
      },
      input: {
        borderRadius: { value: '8px' },
        borderColor: { value: '#b3d3b0' },
        fontSize: { value: '1rem' },
        color: { value: '#555' },
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
      <div className="App">
        <Authenticator>
          {({ signOut }) => (
            <main>
              <header className="App-header">
                <h1>Smart Waste Management App</h1>
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
