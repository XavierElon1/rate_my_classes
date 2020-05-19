import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';
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
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'http://localhost:5000/auth';
/*eslint-disable */

class AuthPage extends Component {
	constructor(props){
		super(props);
		this.messages = {
			INVALID_TXT: 'You must enter a value.',
			EMAIL_SENT: 'Email sent successfully!',
			SERVER_FAILURE: 'Sorry something went wrong!\nPlease give us time to fix it.'
		};

		this.state = {
			email: {
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
  	const {email} = this.state;
  	const body = {
  		email: email.inputValue,
  		redirect: window.location.href.slice(0,-4),
  	};
  	try {
  		axios.post(`${AUTH_URL}`,
			 JSON.stringify(body), {
  			headers: {'content-type': 'application/json'},
  		})
  			.then((res) => {
  				if (res && res.status == 200) {
  					this.setState({
  						showSuccessAlert: true,
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
        const { match: { params } } = this.props;
        if (params.token != 'get') {
            sessionStorage.setItem('token',params.token);
            return <Redirect to='/' />
        }

        const {classes} = this.props;
        return (
            <Grid justify='center' container>
                <Grid item xs={12}>
                    <Typography
                        align='center'
                        color='primary'
                        variant='h5'
                    >Submit your university email to request an access link for your university.
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
                                    name='email'
                                    value={this.state.email.inputValue}
                                label='Please enter your university email'
                                variant='outlined'
                                placeholder='eg. student@university.edu'
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <Class />
                                        </InputAdornment>
                                    ),
                                }}
                                onChange={this.handleChange}
                                helperText={this.state.email.showError ? this.messages.INVALID_TXT :''}
                                error={this.state.email.showError}
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
                                    disabled={(this.state.email.inputValue < 3) || !this.state.email.inputValue.includes('@')}
                                    onClick={this.onAddTapped}>Send
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
                    {this.messages.EMAIL_SENT}
                </Alert>
            </Snackbar>
            </Grid>
        );
	}
}

export default withStyles(styles)(AuthPage);