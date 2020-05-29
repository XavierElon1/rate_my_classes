import React from 'react';
import './App.css';
import {MainContent, RMCAppBar, RMCDrawer} from './components';
import Routes from './Routes';

import createOverrides from './common/RMCTheme';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import styled from 'react-emotion';

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

const Body = styled('div')`
  * {
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
  }
  height: 100%;
  font-family: "Roboto";
  padding-top: 0.1px;
`;
// classes
const Wrapper = styled('div')`
  width: 1200px;
  margin: 0 auto;
  float: none;
  background-color: #fff;
`;
// session debug token
// sessionStorage.setItem(
// 	'token',
// 	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRoaW5kakBvcmVnb25zdGF0ZS5lZHUiLCJleHBpcmF0aW9uIjoiMjAyMC0wNS0yOFQxMTowNTozNi44NTZaIiwiaWF0IjoxNTkwNjIwNzM2fQ.RvWHRntR7g-gl1FfqeZWxtwSI4xs5MxrK_4o_N_F0is'
// );

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
					<Body>
						<Wrapper>
							<Routes />
						</Wrapper>
					</Body>
				</MainContent>
			</div>
		</MuiThemeProvider>
	);
}

export default App;
