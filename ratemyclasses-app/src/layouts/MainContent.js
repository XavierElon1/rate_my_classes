import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

var styles = makeStyles(theme => ({
	root: {
		padding: '10px',
	},
	// necessary for content to be below app bar
	toolbar: theme.mixins.toolbar,
}));

const MainContent = (props) => {
	const classes = styles();
	return (
		<main className={classes.root}>
			<div className={classes.toolbar} />
		  {props.children}
	  </main>);
};

export default MainContent;