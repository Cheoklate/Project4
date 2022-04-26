import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import './styles.scss';

import App from './App.jsx';

// const SignupPage = lazy(() => import('./components/Signup.jsx'));
// Create element for React to render into
const rootElement = document.createElement('div');
// const Routes = () => (
// 	<Switch>
// 		<Suspense fallback={<div>Loading Page...</div>}>
// 			<Route path='signup' component={SignupPage} />
// 		</Suspense>
// 	</Switch>
// );
// Put that element on the page
document.body.appendChild(rootElement);

// Create React root element to render other React elements into
const root = createRoot(rootElement);

// Render React app in the React root element
root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<App />} />
			<Route path='signup' element={<SignUp />} />
		</Routes>
	</BrowserRouter>
);
