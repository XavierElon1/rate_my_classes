import React, {Component} from 'react';
import {
	Grid,
	TextField,
	InputAdornment,
	Typography,
	MenuItem,
	Button,
} from '@material-ui/core';
import {
	QueryBuilder,
	Face,
	StarBorder,
	ThumbsUpDownOutlined,
	ClassOutlined,
} from '@material-ui/icons';
import {withStyles} from '@material-ui/core/styles';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import {Redirect} from 'react-router-dom';

const styles = {
	root: {},
	form: {
		margin: '20px 0',
	},
	buttonGroup: {
		textAlign: 'center',
	},
	selectInput: {
		width: '25ch',
	},
	leftInput: {
		textAlign: 'left',
	},
};

/*eslint-disable */
const REVIEW_URL = process.env.REACT_APP_REVIEWS_URL || "http://localhost:5000/reviews";
const AUTH_URL = process.env.REACT_APP_AUTH_URL || "http://localhost:5000/auth";
/*eslint-disable */

class RateCoursePage extends Component {
  constructor(props) {
    super(props);
    const {coursePrefix, courseName} = this.props.match.params;
    this.messages = {
      INVALID_TXT: "You must enter a value.",
      COURSE_ADDED: "Your course have been successfully added!",
      SERVER_FAILURE:
        "Sorry something went wrong!\nPlease give us time to fix it.",
    };

    this.ratings = [
      { value: "1", label: "1" },
      { value: "2", label: "2" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
      { value: "5", label: "5" },
    ];

    this.grades = [
      { value: "A", label: "A" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B", label: "B" },
      { value: "B-", label: "B-" },
      { value: "C+", label: "C+" },
      { value: "C", label: "C" },
      { value: "C-", label: "C-" },
      { value: "D+", label: "D+" },
      { value: "D", label: "D" },
      { value: "D-", label: "D-" },
      { value: "F", label: "F" },
    ];

    this.state = {
      courseTitle: coursePrefix + ' ' + courseName,
      token: sessionStorage.getItem("token"),
      professorName: {
        showError: false,
        inputValue: "",
      },
      hoursPerWeek: {
        showError: false,
        inputValue: "",
      },
      courseRating: {
        showError: false,
        inputValue: "",
      },
      difficultyRating: {
        showError: false,
        inputValue: "",
      },
      courseGrade: {
        showError: false,
        inputValue: "",
      },
      courseDescription: {
        showError: false,
        inputValue: "",
      },
      showErrorAlert: false,
      showSuccessAlert: false,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: { inputValue: value, showError: value.length < 1 },
    });
  };

  isFormValid = () => {
    return (
      this.state.professorName.inputValue < 1 ||
      this.state.hoursPerWeek.inputValue < 1 ||
      this.state.courseRating.inputValue < 1 ||
      this.state.difficultyRating.inputValue < 1 ||
      this.state.courseGrade.inputValue < 1 ||
      this.state.courseDescription.inputValue < 1
    );
  };

  onCancelTapped = () => {
    this.props.history.goBack();
  };

  handleSnackBarClose = () => {
    this.setState({ showErrorAlert: false, showSuccessAlert: false });
  };

  onAddTapped = async (event) => {
    event.preventDefault();
    const {
      professorName,
      hoursPerWeek,
      courseRating,
      difficultyRating,
      courseGrade,
      courseDescription,
    } = this.state;
    const body = {
      professor: professorName.inputValue,
      hoursPerWeek: hoursPerWeek.inputValue,
      body: courseDescription.inputValue,
      rating: courseRating.inputValue,
      difficulty: difficultyRating.inputValue,
      grade: courseGrade.inputValue,
    };

    try {
      const { courseId } = this.props.match.params;
      const url = `${REVIEW_URL}/` + `${courseId}`;
      axios
        .put(url, JSON.stringify(body), {
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + `${sessionStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          if (res && res.status == 201) {
            this.setState({
              showSuccessAlert: true,
              professor: { inputValue: "" },
              hoursPerWeek: { inputValue: "" },
              body: { inputValue: "" },
              rating: { inputValue: "" },
              difficulty: { inputValue: "" },
              grade: { inputValue: "" },
            });
            this.props.history.goBack();
            return;
          }
          this.setState({
            showErrorAlert: true,
            showSuccessAlert: false,
          });
        });
    } catch (e) {
      console.error(e);
      this.setState({
        showErrorAlert: true,
        showSuccessAlert: false,
      });
    }
  };

  render() {
    if (!sessionStorage.getItem("token")) {
      return <Redirect to={{ 
        pathname : '/auth/get',
          state : {
              redirect :  this.props.location.pathname,
          },
      }} />;
    } else {
      try {
        axios
          .get(`${AUTH_URL}` + "/" + `${sessionStorage.getItem("token")}`)
          .then((res) => {
            if (res && res.status != 200) {
              return <Redirect to={{ 
                pathname : '/auth/get',
                  state : {
                      redirect :  this.props.location.pathname
                  }
              }} />;
            }
          })
          .catch((error) => {
            return <Redirect to={{ 
              pathname : '/auth/get',
                state : {
                    redirect :  this.props.location.pathname
                }
            }} />;
          });
      } catch {
        return <Redirect to={{ 
          pathname : '/auth/get',
            state : {
                redirect :  this.props.location.pathname
            }
        }} />;
      }
    }
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography align="center" color="primary" variant="h5">
            {this.state.courseTitle} Class Review
          </Typography>
        </Grid>
        <form noValidate autoComplete="off" className={classes.form}>
          <Grid container spacing={4}>
            <Grid xs={12} item>
              <TextField
                name="professorName"
                value={this.state.professorName.inputValue}
                label="Please enter your professor"
                variant="outlined"
                placeholder="eg. John Walker"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Face />
                    </InputAdornment>
                  ),
                }}
                error={this.state.professorName.showError}
                onChange={this.handleChange}
                helperText={
                  this.state.professorName.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                autoFocus
                fullWidth
              />
            </Grid>
            <Grid xs={12} item>
              <TextField
                name="hoursPerWeek"
                value={this.state.hoursPerWeek.inputValue}
                label="Please enter hours per week"
                variant="outlined"
                type="number"
                inputProps={{ min: "0", max: "40" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <QueryBuilder />
                    </InputAdornment>
                  ),
                }}
                error={this.state.hoursPerWeek.showError}
                onChange={this.handleChange}
                helperText={
                  this.state.hoursPerWeek.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                fullWidth
              />
            </Grid>
            <Grid md={4} className={classes.leftInput} item>
              <TextField
                select
                name="courseRating"
                label="Select your course rating"
                variant="outlined"
                value={this.state.courseRating.inputValue}
                onChange={this.handleChange}
                helperText={
                  this.state.professorName.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                className={classes.selectInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <StarBorder />
                    </InputAdornment>
                  ),
                }}
              >
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
                name="difficultyRating"
                label="Select your course difficulty"
                variant="outlined"
                value={this.state.difficultyRating.inputValue}
                onChange={this.handleChange}
                helperText={
                  this.state.difficultyRating.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                className={classes.selectInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ThumbsUpDownOutlined />
                    </InputAdornment>
                  ),
                }}
              >
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
                name="courseGrade"
                label="Your course grade"
                variant="outlined"
                value={this.state.courseGrade.inputValue}
                onChange={this.handleChange}
                helperText={
                  this.state.courseGrade.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                className={classes.selectInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ClassOutlined />
                    </InputAdornment>
                  ),
                }}
              >
                {this.grades.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid xs={12} className={classes.leftInput} item>
              <TextField
                name="courseDescription"
                label="Your review of the course"
                variant="outlined"
                multiline
                rows={5}
                style={{ width: "500px" }}
                value={this.state.courseDescription.inputValue}
                onChange={this.handleChange}
                helperText={
                  this.state.courseDescription.showError
                    ? this.messages.INVALID_TXT
                    : ""
                }
                error={this.state.courseDescription.showError}
              ></TextField>
            </Grid>
            <Grid container xs={12} className={classes.buttonGroup} item>
              <Grid xs={6} item>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  onClick={this.onCancelTapped}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid xs={6} item>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={this.isFormValid()}
                  onClick={this.onAddTapped}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={this.state.showErrorAlert} transitionDuration={500}>
          <Alert severity="error" onClose={this.handleSnackBarClose}>
            {this.messages.SERVER_FAILURE}
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.showSuccessAlert} transitionDuration={500}>
          <Alert severity="success" onClose={this.handleSnackBarClose}>
            {this.messages.COURSE_ADDED}
          </Alert>
        </Snackbar>
      </Grid>
    );
  }
}

export default withStyles(styles)(RateCoursePage);
