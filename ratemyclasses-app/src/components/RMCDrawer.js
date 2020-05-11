import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import {withStyles} from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Home, AccountBalance, Class} from '@material-ui/icons/';
import {withRouter} from 'react-router-dom';

const drawerWidth = '12rem';

const useStyles = theme => ({
	root: {
		display: 'flex'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: theme.palette.primary.main,
		color: 'white'
	},
	drawerContainer: {
		overflow: 'auto'
	},
	listItemIcon: {
		minWidth: '40px'
	},
	listItemRoot: {
		'&$selected, &$selected:hover, &$selected:focus': {
			backgroundColor: theme.palette.secondary.main,
		},
		'&:hover': {
			backgroundColor: theme.palette.secondary.main,
		},
	},
	selected: {},
});

class RMCDrawer extends Component {
	constructor(props){
		super(props);
		const tabs = [
			{
				title: 'Home',
				path: '/',
				icon: 'Home',
				id: '1',
			},
			{
				title: 'Rate Course',
				path: '/rate-course',
				icon: 'Class',
				id: '2'
			},
			{
				title: 'Add Course',
				path: '/add-course',
				icon: 'University',
				id: '3',
			},
			{
				title: 'Rate University',
				path: '/rate-University',
				icon: 'University',
				id: '4',
			},
		];
		this.state = {
			tabs: tabs,
			selectedTab: this.props.history.location.pathname,
		};
	}
  
  getIcon = (tab) => {
  	switch (tab.icon) {
  	case 'Home':
  		return <Home color={(this.state.selectedTab === tab.path) ? 'primary' : 'secondary'}/>;
  	case 'University':
  		return <AccountBalance color={(this.state.selectedTab === tab.path) ? 'primary' : 'secondary'}/>;
  	case 'Class':
  		return <Class color={(this.state.selectedTab === tab.path) ? 'primary' : 'secondary'} />;
  	default:
  		break;
  	}
  }

  handleListItemClick = (event, path) => {
  	this.setState({selectedTab: path});
  	this.props.history.push(path);
  }
  
  render(){
  	const {classes} = this.props;
  	const listItems = this.state.tabs.map((tab) => (
  		<ListItem 
  			button
  			key={tab.id}
  			onClick={(event) => this.handleListItemClick(event, tab.path)}
  			selected={this.state.selectedTab === tab.path}
  			classes={{root: classes.listItemRoot, selected: classes.selected}}
  			divider>
  			<ListItemIcon 
  				classes={{root: classes.listItemIcon}}>
  				{this.getIcon(tab)}
  			</ListItemIcon>
  			<ListItemText primary={tab.title} />
  		</ListItem>
  	));
  	return (
  		<div className={classes.root}>
  			<Drawer
  				className={classes.drawer}
  				variant='permanent'
  				classes={{paper: classes.drawerPaper}}>
  				<Toolbar />
  				<div className={classes.drawerContainer}>
  					<List>
  						{listItems}
  					</List>
  				</div>
  			</Drawer>
  		</div>
  	);
  }
	
}

export default withRouter(withStyles(useStyles)(RMCDrawer));
