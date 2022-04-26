import React, { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import SignUp from './components/SignUp.jsx';
import SignIn from './components/SignIn.jsx';
import Blog from './components/Blog/Blog.jsx';

import './styles.scss';

const rootElement = document.createElement('div');

document.body.appendChild(rootElement);

const root = createRoot(rootElement);

root.render(
	<BrowserRouter>
		<Routes>
			<Route path='/' element={<Blog />} />
			<Route path='signup' element={<SignUp />} />
			<Route path='signin' element={<SignIn />} />
			<Route path='dashboard' element={<SignUp />} />
		</Routes>
	</BrowserRouter>
);
