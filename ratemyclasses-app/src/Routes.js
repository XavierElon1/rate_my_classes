import React from 'react';
import {Switch, withRouter, Route} from 'react-router-dom';
import RMCAppBar from './components/RMCAppBar/RMCAppBar';
import NavigationTabs from './components/NavigationTabs/NavigationTabs';
import LandingPage from './pages/LandingPage';
import RateCoursePage from './pages/RateCoursePage';
import RateUniversityPage from './pages/RateUniversityPage';
import CourseView from './pages/CourseView';
// import * as styles from "./app.styles";

// import "./App.css";

function Routes() {
	return (
		<div className='App'>
			<RMCAppBar />
			<NavigationTabs />
			<Switch>
				<Route exact path='/' component={LandingPage} />
				<Route exact path='/rate-course' component={RateCoursePage} />
				<Route exact path='/rate-University' component={RateUniversityPage} />
				<Route exact path='/view-course' component={CourseView} />
			</Switch>
		</div>
	);
}

export default withRouter(Routes);
