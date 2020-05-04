import React, {Component} from 'react';
import {Button, Grid, TextField, InputAdornment, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
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

  onPostTapped = () => {
  	console.log('Post!');
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
  				>Add a Course
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
  							label='Please select a university'
  							variant='outlined'
  							placeholder='eg. Oregon State University'
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
  							label='Please enter a course'
  							variant='outlined'
  							placeholder='eg. CS261 Data Structures'
  							fullWidth
  						/>
  					</Grid>
  					<Grid xs={12} item>
  						<TextField
  							label='Time spent per week'
  							variant='outlined'
  							fullWidth
  							type='number'
  							inputProps={{min: 1, max: 40}}
  						/>
  					</Grid>
  					<Grid xs={12} item>
  						<TextField
  							id='outlined-multiline-static'
  							label='Course Description'
  							rows={5}
  							variant='outlined'
  							multiline
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
  								onClick={this.onPostTapped}>Post
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
