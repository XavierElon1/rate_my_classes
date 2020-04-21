import React from 'react';
import RMCAppBar from './components/RMCAppBar/RMCAppBar';
import LandingPage from './components/LandingPage';
import {ThemeProvider} from '@material-ui/core/styles';
import RMCTheme from './common/RMCTheme';
import './App.css';

function App() {
	return (
	// set at the top of the tree to pass app's theme down its children
		<ThemeProvider theme={RMCTheme}>
			<div className='App'>
				<RMCAppBar />
				<LandingPage />
			</div>
		</ThemeProvider>
	);
}

export default App;
