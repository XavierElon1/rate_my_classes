import React, {Component} from 'react';
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
	}
  
  onCancelTapped = () => {
  	console.log('clicked');
  	this.props.history.goBack();
  };

  onAddTapped = () => {
  	console.log('Course Added!');
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
  							fullWidth/>
  					</Grid>
  					<Grid xs={12} item>
  						<TextField
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
