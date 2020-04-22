import React from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import {Route, Switch} from 'react-router-dom';

import './App.css';

import RMCAppBar from './components/RMCAppBar/RMCAppBar';
import NavigationTabs from './components/NavigationTabs/NavigationTabs';
import LandingPage from './pages/LandingPage';
import RateCoursePage from './pages/RateCoursePage';
import RateUniversityPage from './pages/RateUniversityPage';
import RMCTheme from './common/RMCTheme';

function App() {
	return (
	// set at the top of the tree to pass app's theme down its children
		<ThemeProvider theme={RMCTheme}>
			<div className='App'>
				<RMCAppBar />
				<NavigationTabs/>
				<Switch>
					<Route exact path='/' component={LandingPage}/>
					<Route path='/rate-course' component={RateCoursePage}/>
					<Route path='/rate-University' component={RateUniversityPage}/>
				</Switch>
			</div>
		</ThemeProvider>
	);
}

export default App;
