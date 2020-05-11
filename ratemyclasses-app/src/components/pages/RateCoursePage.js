import React, {Component} from 'react';
import {Grid, TextField, InputAdornment, Typography, MenuItem} from '@material-ui/core';
import {QueryBuilder, Face, StarBorder, ThumbsUpDownOutlined, ClassOutlined} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';

const styles = {
	root: {
	},
	form: {
		margin: '20px 0'
	},
	buttonGroup: {
		textAlign: 'center'
	},
	selectInput: {
		width: '25ch',
	},
	leftInput: {
		textAlign: 'left'
	}
};

class RateCoursePage extends Component {
	constructor(props){
		super(props);
		this.messages = {
			INVALID_TXT: 'You must enter a value.',
			COURSE_ADDED: 'Your course have been successfully added!',
			SERVER_FAILURE: 'Sorry something went wrong!\nPlease give us time to fix it.'
		};

		this.ratings = [
			{value: '1', label: '1'},
		 	{value: '2', label: '2'},
			{value: '3', label: '3'},
			{value: '4', label: '4'},
			{value: '5', label: '5'}
		];

		this.grades = [
			{value: 'A', label: 'A'},
		 	{value: 'A-', label: 'A-'},
			{value: 'B+', label: 'B+'},
			{value: 'B', label: 'B'},
			{value: 'B-', label: 'B-'},
			{value: 'C+', label: 'C+'},
			{value: 'C', label: 'C'},
			{value: 'C-', label: 'C-'},
			{value: 'F', label: 'C'},

		];

		this.state = {
			professorName: {
				showError: false,
				inputValue: ''
			},
			hoursPerWeek: {
				showError: false,
				inputValue: ''
			},
			courseRating: {
				showError: false,
				inputValue: ''
			},
			difficultyRating: {
				showError: false,
				inputValue: ''
			},
			courseGrade: {
				showError: false,
				inputValue: ''
			},
			courseDescription: {
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

	render() {
		const {classes} = this.props;
		return (
			<Grid container>
				<Grid item xs={12}>
					<Typography
						align='center'
						color='primary'
						variant='h5'
					>Rate Course For Oregon State University
					</Typography>
				</Grid>
				<form 
					noValidate
					autoComplete='off'
					className={classes.form}>
					<Grid container spacing={4}>
						<Grid xs={12} item>
							<TextField
								name='professorName' 
								value={this.state.professorName.inputValue}
								label='Please enter your professor'
								variant='outlined'
								placeholder='eg. John Walker'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<Face />
										</InputAdornment>
									),
								}}
								error={this.state.professorName.showError}
								onChange={this.handleChange}
								helperText={this.state.professorName.showError ? this.messages.INVALID_TXT :''}
								autoFocus
								fullWidth/>
						</Grid>
						<Grid xs={12} item>
							<TextField
								name='hoursPerWeek' 
								value={this.state.hoursPerWeek.inputValue}
								label='Please enter hours per week'
								variant='outlined'
								type='number'
								inputProps={{min: '0', max: '40'}}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<QueryBuilder />
										</InputAdornment>
									),
								}}
								error={this.state.hoursPerWeek.showError}
								onChange={this.handleChange}
								helperText={this.state.hoursPerWeek.showError ? this.messages.INVALID_TXT :''}
								fullWidth/>
						</Grid>
						<Grid md={4} className={classes.leftInput} item>
							<TextField
								select
								name='courseRating'
								label='Select your course rating'
								variant='outlined'
								value={this.state.courseRating.inputValue}
								onChange={this.handleChange}
								helperText={this.state.professorName.showError ? this.messages.INVALID_TXT :''}
								className={classes.selectInput}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<StarBorder />
										</InputAdornment>
									),
								}}>
								{this.ratings.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid md={4} className={classes.leftInput} item>
							<TextField
								select
								name='difficultyRating'
								label='Select your course difficulty'
								variant='outlined'
								value={this.state.difficultyRating.inputValue}
								onChange={this.handleChange}
								helperText={this.state.difficultyRating.showError ? this.messages.INVALID_TXT :''}
								className={classes.selectInput}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<ThumbsUpDownOutlined/>
										</InputAdornment>
									),
								}}>
								{this.ratings.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid md={4} className={classes.leftInput} item>
							<TextField
								select
								name='courseGrade'
								label='Please select your course grade'
								variant='outlined'
								value={this.state.courseGrade.inputValue}
								onChange={this.handleChange}
								helperText={this.state.courseGrade.showError ? this.messages.INVALID_TXT :''}
								className={classes.selectInput}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<ClassOutlined/>
										</InputAdornment>
									),
								}}>
								{this.grades.map((option) => (
									<MenuItem key={option.value} value={option.value}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid xs={12} className={classes.leftInput} item>
							<TextField
								name='courseDescription'
								label='Course Description'
								variant='outlined'
								multiline
								rows={5}
								style={{width: '500px'}}
								value={this.state.courseDescription.inputValue}
								onChange={this.handleChange}
								helperText={this.state.courseDescription.showError ? this.messages.INVALID_TXT :''}
								error={this.state.courseDescription.showError}>
							</TextField>
						</Grid>
					</Grid>
				</form>
			</Grid>
		);
	}
}

export default withStyles(styles)(RateCoursePage);
