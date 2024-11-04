import React from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider, createTheme } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import WasteManager from './WasteManager';

Amplify.configure(awsExports);

// Define a custom theme with greens and browns for an earthy, eco-friendly feel
const customTheme = createTheme({
  name: 'eco-friendly-theme',
  tokens: {
    colors: {
      brand: {
        primary: { value: '#4CAF50' }, // Main green color for buttons and highlights
        secondary: { value: '#8D6E63' }, // Accent brown color
      },
      background: {
        primary: { value: '#F1F8E9' }, // Light greenish-beige for a natural background tone
        secondary: { value: '#A1887F' }, // Deeper brown background for accent areas
      },
      font: {
        primary: { value: '#4E342E' }, // Dark brown for text to match the earthy feel
      },
    },
    components: {
      button: {
        primary: {
          backgroundColor: { value: '#4CAF50' },
          color: { value: '#FFFFFF' },
          _hover: {
            backgroundColor: { value: '#388E3C' }, // Darker green on hover
          },
        },
      },
      input: {
        backgroundColor: { value: '#FFFFFF' },
        borderColor: { value: '#8D6E63' },
        borderRadius: { value: '8px' },
        padding: { value: '10px' },
      },
    },
    radii: {
      small: '10px', // Rounded corners for a soft, approachable feel
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <div className="App">
        <Authenticator
          components={{
            SignIn: {
              Header() {
                return (
                  <h3 style={{ color: '#4CAF50', fontFamily: 'Arial, sans-serif' }}>
                    Welcome to the Smart Waste Management App 🌱
                  </h3>
                );
              },
              Footer() {
                return (
                  <p style={{ fontSize: '0.8rem', color: '#8D6E63' }}>
                    Reducing waste, one sign-in at a time.
                  </p>
                );
              },
            },
          }}
        >
          {({ signOut }) => (
            <main>
              <header className='App-header'>
                <h1 style={{ color: '#4CAF50' }}>Smart Waste Management App</h1>
                <WasteManager />
                <button 
                  onClick={signOut} 
                  style={{ 
                    margin: '20px', 
                    fontSize: '0.8rem', 
                    padding: '5px 10px', 
                    backgroundColor: '#4CAF50', 
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    border: 'none'
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
