import React from 'react';
import {ThemeProvider} from '@material-ui/core/styles';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import Routes from './Routes';

import RMCTheme from './common/RMCTheme';

class App extends React.Component {
	render() {
		return (
		// set at the top of the tree to pass app's theme down its children
			<ThemeProvider theme={RMCTheme}>
				<BrowserRouter>
					<Routes />
				</BrowserRouter>
			</ThemeProvider>
		);
	}
}

window.onload = () => {
	ReactDOM.render(<App />, document.getElementById('root'));
};
