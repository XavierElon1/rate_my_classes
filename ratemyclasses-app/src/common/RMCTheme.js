import {createMuiTheme} from '@material-ui/core/styles';

var RMCTheme = createMuiTheme({
	palette: {
		primary: {
			main: '#212121',
		},
		secondary: {
			main: '#D32F2F',
		},
	},
	overrides: {} // used to override MaterialUI Components
});

export default RMCTheme;