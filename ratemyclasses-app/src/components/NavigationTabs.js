import React, {Component} from 'react';
import {Box, Paper, Tabs, Tab, Typography} from '@material-ui/core';
import {withRouter} from 'react-router-dom';

class NavigationTabs extends Component {
	constructor(props) {
		super(props);
		const tabs = [
			{
				title: 'Home',
				path: '/',
				id: '1',
			},
			{
				title: 'Rate Course',
				path: '/rate-course',
				id: '2',
			},
			{
				title: 'Add Course',
				path: '/add-course',
				id: '3',
			},
			{
				title: 'Rate University',
				path: '/rate-University',
				id: '4',
			},
		];
		this.state = {
			tabs: tabs,
			selectedTab: this.props.history.location.pathname,
		};
	}

  handleChange = (event, value) => {
  	this.setState({selectedTab: value});
  	this.props.history.push(value);
  };

  render() {
  	const tabs = this.state.tabs.map((tab) => (
  		<Tab
  			key={tab.id}
  			value={tab.path}
  			label={
  				<Typography color='primary' variant='h6'>
  					{tab.title}
  				</Typography>
  			}
  		/>
  	));
  	return (
  		<Box mb={5}>
  			<Paper square>
  				<Tabs
  					value={this.state.selectedTab}
  					indicatorColor='secondary'
  					textColor='secondary'
  					color='secondary'
  					onChange={this.handleChange}
  					aria-label='Navigation Tabs'
  					variant='fullWidth'
  					centered
  				>
  					{tabs}
  				</Tabs>
  			</Paper>
  		</Box>
  	);
  }
}

export default withRouter(NavigationTabs);
