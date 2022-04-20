import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.scss';

import App from './App.jsx';

// Create element for React to render into
const rootElement = document.createElement('div');

// Put that element on the page
document.body.appendChild(rootElement);

// Create React root element to render other React elements into
const root = createRoot(rootElement);

// Render React app in the React root element
root.render(<App />);
