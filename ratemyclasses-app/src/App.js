import React from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';

import {
	MainContent,
	RMCAppBar,
	RMCDrawer,
	LandingPage,
	RateCoursePage,
	RateUniversityPage,
	AddCoursePage,
} from './components';

import createOverrides from './common/RMCTheme';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const baseTheme = createMuiTheme({
	palette: {
		primary: {
			main: '#212121',
		},
		secondary: {
			main: '#0D7FA1',
		},
	},
});

function App() {
	return (
	// set at the top of the tree to pass app's theme down its children
		<MuiThemeProvider
			theme={{
				...baseTheme,
				overrides: createOverrides(baseTheme),
			}}
		>
			<div className='App'>
				<RMCAppBar />
				<RMCDrawer />
				<MainContent>
					<Switch>
						<Route exact path='/' component={LandingPage} />
						<Route path='/rate-course' component={RateCoursePage} />
						<Route path='/add-course' component={AddCoursePage} />
						<Route path='/rate-University' component={RateUniversityPage} />
					</Switch>
				</MainContent>
			</div>
		</MuiThemeProvider>
	);
}

export default App;
