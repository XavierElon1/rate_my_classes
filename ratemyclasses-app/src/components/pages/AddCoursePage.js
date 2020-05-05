import React, {Component} from 'react';
import axios from 'axios';
import {Button, Grid, TextField, InputAdornment, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {Class, School} from '@material-ui/icons';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

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

/*eslint-disable */
const REACT_APP_INSTITUTIONS_URL = process.env.INSTITUTIONS_URL || 'http://localhost:5000/courses/';
/*eslint-disable */

class AddCoursePage extends Component {
	constructor(props){
		super(props);
		this.messages = {
			INVALID_TXT: 'You must enter a value.',
			COURSE_ADDED: 'Your course have been successfully added!',
			SERVER_FAILURE: 'Sorry something went wrong!\nPlease give us time to fix it.'
		};

		this.state = {
			institutionID: '5ea48a344f431a756c7d44d8',
			courseID: {
				showError: false,
				inputValue: ''
			},
			courseTitle: {
				showError: false,
				inputValue: ''
			},
			showErrorAlert: false,
			showSuccessAlert: false
		};
	}

	handleChange = event => {
		const {value, name} = event.target;
		this.setState({[name]:{inputValue: value, showError: (value.length < 1)}
		});
	}
  
  onCancelTapped = () => {
  	this.props.history.goBack();
  };

  onAddTapped = async event => {
  	event.preventDefault();
  	const {institutionID, courseID, courseTitle} = this.state;
  	const body = {
  		title: courseTitle.inputValue,
  		courseID: courseID.inputValue,
  		body: `${courseID.inputValue}${courseTitle.inputValue}`
  	};
  	try {
  		axios.put(`${INSTITUTIONS_URL}` + `${institutionID}`,
			 JSON.stringify(body), {
  			headers: {'content-type': 'application/json'},
  		})
  			.then((res) => {
  				if (res && res.status == 201) {
  					this.setState({
  						showSuccessAlert: true,
  						courseID: {inputValue: ''},
  						courseTitle: {inputValue: ''}
  					});
  					return;
  				}
  				this.setState({
  					showErrorAlert: true,
  					showSuccessAlert: false
  				});
  			});
  	} catch (e) {
  		console.error(e);
  		this.setState({showErrorAlert: true});
  	}
  };
	
	handleSnackBarClose = () => {
		this.setState({showErrorAlert: false, showSuccessAlert: false});
	}

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
								value={this.state.courseID.inputValue}
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
  							helperText={this.state.courseID.showError ? this.messages.INVALID_TXT :''}
  							autoFocus
  							fullWidth/>
  					</Grid>
  					<Grid xs={12} item>
  						<TextField
								name='courseTitle'
								value={this.state.courseTitle.inputValue}
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
  							helperText={this.state.courseTitle.showError ? this.messages.INVALID_TXT :''}
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
				<Snackbar
				 	open={this.state.showErrorAlert}
					transitionDuration={500}>
  				<Alert severity='error' onClose={this.handleSnackBarClose}>
						{this.messages.SERVER_FAILURE}
  				</Alert>
				</Snackbar>
				<Snackbar
					open={this.state.showSuccessAlert}
			 		transitionDuration={500}>
			 <Alert severity='success' onClose={this.handleSnackBarClose}>
				 {this.messages.COURSE_ADDED}
			 </Alert>
		 </Snackbar>
  		</Grid>
  	);
	}
}

export default withStyles(styles)(AddCoursePage);
