import React, {Component} from 'react';
import axios from 'axios';
import {Button, Grid, TextField, InputAdornment, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Class from '@material-ui/icons/Class';
import School from '@material-ui/icons/School';

const styles = {
	root: {
	},
	form: {
		margin: '20px 0'
	},
	buttonGroup: {
		textAlign: 'center'
	},
};

class AddCoursePage extends Component {
	constructor(props){
		super(props);
		this.messages = {
			invalidText: 'You must enter a value.'
		};

		this.state = {
			institutionID: '1234',
			courseID: {
				showError: false,
				inputValue: ''
			},
			courseTitle: {
				showError: false,
				inputValue: ''
			}
		};
	}

	handleChange = event => {
		const {value, name} = event.target;
		this.setState({[name]:{inputValue: value, showError: (value.length < 1)}, 
		}, ()=> {
			console.log('field value: ', this.state);
		});
	}
  
  onCancelTapped = () => {
  	this.props.history.goBack();
  };

  onAddTapped = event => {
  	event.preventDefault();
  	const {institutionID, courseID, courseTitle} = this.state;
  	console.log('institutionID: ', institutionID);
  	console.log('courseID: ', courseID);
  	console.log('courseTitle: ', courseTitle);
  	try {
  		axios
  			.put('http://localhost:5000/courses/'+ `${institutionID}`, {crossdomain: true})
  			.then((res) => {
  				if (res.data.length > 0) {
  					console.log('Course Added!');
  					console.log('got response: ' + res.data);
  				}
  			});
  	} catch (e) {
  		console.error(e);
  	}
  };

  render() {
  	const {classes} = this.props;
  	return (
  		<Grid justify='center' container>
  			<Grid item xs={12}>
  				<Typography
  					align='center'
  					color='primary'
  					variant='h4'
  				>Add a Course To {'Oregon State University'}
  				</Typography>
  			</Grid>
  			<form 
  				noValidate
  				autoComplete='off'
  				className={classes.form}
  			>
  				<Grid container spacing={3}>
  					<Grid xs={12} item>
  						<TextField
  							name='courseID' 
  							label='Please enter the course ID'
  							variant='outlined'
  							placeholder='eg. CS261'
  							InputProps={{
  								startAdornment: (
  									<InputAdornment position='start'>
  										<School />
  									</InputAdornment>
  								),
  							}}
  							error={this.state.courseID.showError}
  							onChange={this.handleChange}
  							helperText={this.state.courseID.showError ? this.messages.invalidText :''}
  							autoFocus
  							fullWidth/>
  					</Grid>
  					<Grid xs={12} item>
  						<TextField
  							name='courseTitle'
  							label='Please enter the course title'
  							variant='outlined'
  							placeholder='eg. Data Structures'
  							InputProps={{
  								startAdornment: (
  									<InputAdornment position='start'>
  										<Class />
  									</InputAdornment>
  								),
  							}}
  							onChange={this.handleChange}
  							helperText={this.state.courseTitle.showError ? this.messages.invalidText :''}
  							error={this.state.courseTitle.showError}
  							fullWidth
  						/>
  					</Grid>
  					<Grid container xs={12} className={classes.buttonGroup} item>
  						<Grid xs={6} item>
  							<Button
  								variant='outlined'
  								color='secondary'
  								size='large'
  								onClick={this.onCancelTapped}>Cancel
  							</Button>
  						</Grid>
  						<Grid xs={6} item>
  							<Button
  								variant='contained'
  								color='primary'
  								size='large'
  								disabled={(this.state.courseID.inputValue < 1) || this.state.courseTitle.inputValue < 1}
  								onClick={this.onAddTapped}>Add
  							</Button>
  						</Grid>
  					</Grid>
  				</Grid>
  			</form>
  		</Grid>
  	);
  }
}

export default withStyles(styles)(AddCoursePage);
