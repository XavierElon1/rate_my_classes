import React, {useEffect, useState} from 'react';
import * as styles from './pageStyles.styles';
import {makeStyles} from '@material-ui/core/styles';
// import Paper from "@material-ui/core/Paper";
// import Grid from "@material-ui/core/Grid";
import {Button} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import axios from 'axios';
import {useParams, useHistory} from 'react-router-dom';
import Spinner from '../../components/tools/Spinner';
import PieChart from '../tools/PieChart';
import MaterialTabSelector from '../tools/MaterialTabSelector';

/*eslint-disable */
const COURSES_URL =
  process.env.REACT_APP_COURSES_URL || "http://localhost:5000/courses";
const REVIEWS_URL =
  process.env.REACT_APP_REVIEWS_URL || "http://localhost:5000/reviews";
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
  addReviewBtn: {
    backgroundColor: theme.palette.secondary.main,
  },
  spanStyle: {
    display: "block",
    float: "left",
    height: "16px",
    width: "90px",
    marginRight: "15px",
    marginLeft: "0",
    border: "1px solid #999",
    padding: "5px",
  },
  listItemStyle: {
    fontSize: "16px",
    listStyle: "none",
    marginLeft: "0",
    lineHeight: "18px",
    marginBottom: "5px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  listStyle: {
    marginBottom: "5px",
    float: "left",
    listStyle: "none",
  },
  legendStyle: {
    marginBottom: "5px",
    marginLeft: "20px",
    fontWeight: "bold",
    fontSize: "90%",
  },
}));

function CourseInfo() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [difficultyScoreCount, setDifficultyScoreCount] = useState({
    average: 0,
    ratings: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
    label: "Difficulty",
  });

  const [ratingScoreCount, setRatingScoreCount] = useState({
    average: 0,
    ratings: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
    label: "Rating",
  });
  const [hoursCount, setHoursCount] = useState({
    average: 0,
    ratings: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
    label: "Hours Per Week",
  });

  const getPercentange = (obj, ratingKey) => {
    let total = 0;
    for (let rating in obj) {
      total += obj[rating];
    }
    const count = obj[ratingKey];
    return ((obj[ratingKey] / total) * 100).toFixed(0);
  };

  const { uniId, courseId } = useParams();

  const classes = useStyles();
  const history = useHistory();
  const loadReviews = async () => {
    try {
      axios
        .get(`${REVIEWS_URL}/${courseId}`, {
          headers: new Headers({
            Accept: "application/json",
          }),
          crossdomain: true,
        })
        .then((res) => {
          if (res.data) {
            res.data.reviews.map((review) => {
              difficultyScoreCount.ratings[review.difficulty] =
                difficultyScoreCount.ratings[review.difficulty] + 1;
              ratingScoreCount.ratings[review.rating] =
                ratingScoreCount.ratings[review.rating] + 1;
              if (review.hoursPerWeek < 10) {
                hoursCount.ratings["5"] = hoursCount.ratings["5"] + 1;
              } else if (review.hoursPerWeek < 20) {
                hoursCount.ratings["4"] = hoursCount.ratings["4"] + 1;
              } else if (review.hoursPerWeek < 30) {
                hoursCount.ratings["3"] = hoursCount.ratings["3"] + 1;
              } else if (review.hoursPerWeek < 40) {
                hoursCount.ratings["2"] = hoursCount.ratings["2"] + 1;
              } else {
                hoursCount.ratings["1"] = hoursCount.ratings["1"] + 1;
              }
            });
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
            Accept: "application/json",
          }),
          crossdomain: true,
        })
        .then((res) => {
          if (res.data) {
            console.log('res.data: ', res.data);
            difficultyScoreCount["average"] = res.data.averageDifficulty;
            ratingScoreCount["average"] = res.data.averageRating;
            hoursCount["average"] = res.data.averageHoursPerWeek;
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
  }, []);

  if (!selectedCourse) {
    return <div>Loading...</div>;
  }

  const addReviewTapped = () => {
    history.push({
      pathname: "/rate-course/" + uniId + "/" + courseId
    });
  };

  const renderPieChart = (obj) => {
    return (
      <div className={styles.row} style={{ justifyContent: "center" }}>
        <div style={{ width: "250px" }}>
          <PieChart
            slices={[
              {
                color: "#c92b10",
                value: obj.ratings[1],
              },

              {
                color: "#ef6036",
                value: obj.ratings[2],
              },

              {
                color: "#c910ae",
                value: obj.ratings[3],
              },

              {
                color: "#10aec9",
                value: obj.ratings[4],
              },

              {
                color: "#10c92b",
                value: obj.ratings[5],
              },
            ]}
          />
        </div>
        <div className={classes.legendStyle}>
          <h2>
            Average {obj["label"]}: {obj["average"]}
          </h2>

          <ul className={classes.listStyle}>
            <li className={classes.listItemStyle}>
              <span
                className={classes.spanStyle}
                style={{ background: "#c92b10", color: "white" }}
              >
                {obj["label"] === "Hours Per Week" ? "40+ hours" : "1/5"}
              </span>{" "}
              <span style={{ marginLeft: "5px" }}>
                {getPercentange(obj.ratings, 1)}%
              </span>
            </li>
            <li className={classes.listItemStyle}>
              <span
                className={classes.spanStyle}
                style={{ background: "#ef6036", color: "white" }}
              >
                {obj["label"] === "Hours Per Week" ? "30-39 hours" : "2/5"}
              </span>{" "}
              <span style={{ marginLeft: "5px" }}>
                {getPercentange(obj.ratings, 2)}%
              </span>
            </li>
            <li className={classes.listItemStyle}>
              <span
                className={classes.spanStyle}
                style={{ background: "#c910ae", color: "white" }}
              >
                {obj["label"] === "Hours Per Week" ? "20-29 hours" : "3/5"}
              </span>{" "}
              <span style={{ marginLeft: "5px" }}>
                {getPercentange(obj.ratings, 3)}%
              </span>
            </li>
            <li className={classes.listItemStyle}>
              <span
                className={classes.spanStyle}
                style={{ background: "#10aec9", color: "white" }}
              >
                {obj["label"] === "Hours Per Week" ? "10-19 hours" : "4/5"}
              </span>
              <span style={{ marginLeft: "5px" }}>
                {getPercentange(obj.ratings, 4)}%
              </span>
            </li>
            <li className={classes.listItemStyle}>
              <span
                className={classes.spanStyle}
                style={{ background: "#10c92b", color: "white" }}
              >
                {" "}
                {obj["label"] === "Hours Per Week" ? "0-9 hours" : "5/5"}
              </span>
              <span style={{ marginLeft: "5px" }}>
                {getPercentange(obj.ratings, 5)}%
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const tabs = [
    {
      text: "Difficulty Stats",
      value: "difficulty",
      tabComponent: renderPieChart(difficultyScoreCount),
    },
    {
      text: "Rating Stats",
      value: "ratings",
      tabComponent: renderPieChart(ratingScoreCount),
    },
    {
      text: "Hours per Week Stats",
      value: "hours",
      tabComponent: renderPieChart(hoursCount),
    },
  ];

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
            return (
              <styles.Form marginBottom="1.5em" id={review._id}>
                <styles.FlexRow
                  style={{ alignItems: "baseline", height: "initial" }}
                >
                  <styles.FlexColumn
                    style={{
                      width: "30%",
                      margin: "0px 20px",
                      alignItems: "flex-start",
                      textAlign: "left",
                      borderRight: "1px solid rgba(120, 120, 120, 0.5)",
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
                      width: "70%",
                      margin: "0px 20px",
                      alignItems: "flex-start",
                      textAlign: "left",
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
      <div className={styles.col} style={{ textAlign: "left" }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="add-rating"
          className={classes.addReviewBtn}
          onClick={addReviewTapped}
          startIcon={<Create />}
        >
          Add Review
        </Button>
      </div>
      <div className={styles.col}>
        <h1>
          {selectedCourse.title} - {selectedCourse.courseID}
        </h1>
        <MaterialTabSelector tabs={tabs} />

        {/* <Grid container spacing={3}>
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
        </Grid> */}
        <h2>Reviews</h2>
        {renderReviews()}
      </div>
    </div>
  );
}

export default CourseInfo;
