import React from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import {Route, Switch} from 'react-router-dom';

import './App.css';

import RMCAppBar from './components/RMCAppBar/RMCAppBar';
import LandingPage from './components/LandingPage';
import RMCTheme from './common/RMCTheme';

function App() {
	return (
	// set at the top of the tree to pass app's theme down its children
		<ThemeProvider theme={RMCTheme}>
			<div className='App'>
				<RMCAppBar />
				<Switch>
					<Route exact path='/' component={LandingPage}/>
					<Route path='/shop' component={LandingPage}/>
				</Switch>
			</div>
		</ThemeProvider>
	);
}

export default App;
