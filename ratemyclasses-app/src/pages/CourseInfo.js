import React from "react";
import { schools } from "../dummyData/schools";
import * as styles from "./pageStyles.styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

class CourseInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCourse: null,
    };
    this.updateSelectedCourse = this.updateSelectedCourse.bind(this);
  }

  componentDidMount() {
    this.updateSelectedCourse(this.props.match.params.id);
  }

  updateSelectedCourse(id) {
    let foundCourse = null;
    schools.map((school) => {
      return school.courses.map((course) => {
        if (course.id == id) {
          foundCourse = course;
        }
      });
    });

    this.setState({
      selectedCourse: foundCourse,
    });
  }

  useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
  }));

  render() {
    // console.log("rendering with selectedCourse: ");
    // console.log(JSON.stringify(this.state.selectedCourse));
    const { selectedCourse } = this.state;
    if (!selectedCourse) {
      return <div>Loading...</div>;
    }
    return (
      <div className={styles.row}>
        <div className={styles.col}>
          <h1>Course Name: {selectedCourse.title}</h1>
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

          <p>Description: {selectedCourse.body}</p>
        </div>
      </div>
    );
  }
}

export default CourseInfo;
