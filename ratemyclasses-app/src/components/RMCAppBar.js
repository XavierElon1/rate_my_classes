import React from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

var styles = makeStyles((theme) => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	barTitle: {
		flexGrow: 1,
		whiteSpace: 'nowrap',
		textAlign: 'left',
		marginRight: '20px',
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.primary.light, 0.6),
		'&:hover': {
			backgroundColor: fade(theme.palette.primary.light, 0.8),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	button: {
		whiteSpace: 'nowrap',
		'&:hover': {
			backgroundColor: fade(theme.palette.primary.light, 1),
		},
	},
}));

export default function RMCAppBar() {
	const classes = styles();

	return (
		<div>
			<AppBar position='fixed' className={classes.appBar}>
				<Toolbar>
					<Typography variant='h6' className={classes.barTitle}>
            Rate My Classes
					</Typography>
					{/* <div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder='Search…'
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput
							}}
							inputProps={{'aria-label': 'search'}}
						/>
					</div> */}
					<Button color='inherit' className={classes.button}>
            Login
					</Button>
					<Button color='inherit' className={classes.button}>
            Sign Up
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}
