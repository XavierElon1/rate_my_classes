import React, {useEffect, useState} from 'react';
import * as styles from './pageStyles.styles';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {Button} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import axios from 'axios';
import {useParams, useHistory} from 'react-router-dom';
import Spinner from '../../components/tools/Spinner';

/*eslint-disable */
const COURSES_URL =
  process.env.REACT_APP_COURSES_URL || 'http://localhost:5000/courses';
const REVIEWS_URL =
  process.env.REACT_APP_REVIEWS_URL || 'http://localhost:5000/reviews';
/*eslint-disable */

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  rateCourseBtn: {
    position: 'fixed',
    right: '10px',
    bottom: '10px'
  }
}));

function CourseInfo() {
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [reviews, setReviews] = useState([]);
  const {uniId, courseId} = useParams();
  const classes = useStyles();
  const history = useHistory();
	const loadReviews = async () => {
		try {
			axios
				.get(`${REVIEWS_URL}/${courseId}`, {
					headers: new Headers({
						Accept: 'application/json',
					}),
					crossdomain: true,
				})
				.then((res) => {
					if (res.data) {
						console.log(res.data);
						setReviews(res.data.reviews);
					}
				});
		} catch (e) {
			setReviews(null);
			console.error(e);
		}
	};
	const loadSelectedCourse = async () => {
		try {
			axios
				.get(`${COURSES_URL}/${uniId}/${courseId}`, {
					headers: new Headers({
						Accept: 'application/json',
					}),
					crossdomain: true,
				})
				.then((res) => {
					if (res.data) {
						console.log(res.data);
						setSelectedCourse(res.data);
					}
				});
		} catch (e) {
			setSelectedCourse(null);
			console.error(e);
		}
	};

	useEffect(() => {
		loadSelectedCourse();
	}, []);

	useEffect(() => {
		loadReviews();
	}, [selectedCourse]);

	if (!selectedCourse) {
		return <div>Loading...</div>;
  }
  
  const addReviewTapped = () => {
    history.push({pathname: '/rate-course', data: selectedCourse})
  }

	const renderReviews = () => {
		if (selectedCourse.reviews.length === 0) {
			return null;
		} else if (!selectedCourse.reviews) {
			return <Spinner />;
		} else {
			return (
				<React.Fragment>
					{reviews.map((review) => {
						var parsedDate = new Date(review.createdAt).toLocaleDateString();
						console.log(parsedDate);
						return (
							<styles.Form marginBottom='1.5em' id={review._id}>
								<styles.FlexRow
									style={{alignItems: 'baseline', height: 'initial'}}
								>
									<styles.FlexColumn
										style={{
											width: '30%',
											margin: '0px 20px',
											alignItems: 'flex-start',
											textAlign: 'left',
											borderRight: '1px solid rgba(120, 120, 120, 0.5)',
										}}
									>
                    Stats
										<br />
                    Difficulty: {review.difficulty} <br />
                    Grade: {review.grade} <br />
                    Hours per Week: {review.hoursPerWeek} <br />
                    Rating: {review.rating}
										<br />
									</styles.FlexColumn>

									<styles.FlexColumn
										style={{
											width: '70%',
											margin: '0px 20px',
											alignItems: 'flex-start',
											textAlign: 'left',
										}}
									>
										{parsedDate} with Professor {review.professor} <br />
										{review.body}
									</styles.FlexColumn>
								</styles.FlexRow>
							</styles.Form>
						);
					})}
				</React.Fragment>
			);
		}
	};
	

	return (
		<div className={styles.row}>
			<div className={styles.col}>
				<h1>{selectedCourse.title}</h1>
				<Grid container spacing={3}>
					<Grid item xs>
						<Paper className={styles.paper}>
							<styles.H4>
                Average Difficulty: {selectedCourse.averageDifficulty}
							</styles.H4>
						</Paper>
					</Grid>
					<Grid item xs={6}>
						<Paper className={styles.paper}>
							<styles.H3>
                Average Rating: {selectedCourse.averageRating}
							</styles.H3>
						</Paper>
					</Grid>
					<Grid item xs>
						<Paper className={styles.paper}>
							<styles.H4>
                Average Hours Per Week: {selectedCourse.averageHoursPerWeek}
							</styles.H4>
						</Paper>
					</Grid>
				</Grid>
				<h2>Reviews</h2>
				{renderReviews()}
			</div>
			<Button
        variant="contained"
        color="secondary"
        size='small'
				aria-label='add-rating'
        className={classes.rateCourseBtn}
        onClick={addReviewTapped}
        startIcon={<Create />}>
        Rate Course
      </Button>
		</div>
	);
}

export default CourseInfo;
