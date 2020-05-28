/*eslint-disable */
import React, { useEffect, useState } from "react";
// import { schools } from "../dummyData/schools";
import * as styles from "./pageStyles.styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import CourseCard from "../tools/CourseCard";
import { Button } from "@material-ui/core";
import Create from "@material-ui/icons/Create";
import { useHistory } from "react-router-dom";

const INSTITUTIONS_URL =
  process.env.REACT_APP_INSTITUTIONS_URL ||
  "http://localhost:5000/institutions";

const COURSES_URL =
  process.env.REACT_APP_COURSES_URL || "http://localhost:5000/courses";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  addCourseBtn: {
    backgroundColor: theme.palette.secondary.main,
  },
}));
function InstitutionInfo() {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     selectedInstitution: null,
  //   };
  //   this.updateSelectedInstitution = this.updateSelectedInstitution.bind(this);
  // }

  // componentDidMount() {
  //   console.log(this.props.match.params.id);
  //   this.updateSelectedInstitution(this.props.match.params.id);
  // }

  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [courses, setCourses] = useState([]);
  const classes = useStyles();
  const history = useHistory();
  let { id } = useParams();
  console.log("institution info page got institution id from params " + id);

  const renderCourseCards = () => {
    if (courses.length === 0) {
      return null;
    } else if (!selectedInstitution.courses) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          {courses.map((course) => {
            return (
              <div
                key={course._id}
                style={{ display: "inline-block", margin: "4em 1em" }}
              >
                <CourseCard
                  course={course}
                  institutionId={selectedInstitution._id}
                ></CourseCard>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  };

  const loadSelectedInstitution = async () => {
    console.log("loading institution with id: " + id);
    try {
      axios
        .get(`${INSTITUTIONS_URL}/${id}`, {
          headers: new Headers({
            Accept: "application/json",
          }),
          crossdomain: true,
        })
        .then((res) => {
          if (res.data) {
            console.log(res.data);
            setSelectedInstitution(res.data);
          }
        });
    } catch (e) {
      setSelectedInstitution(null);
      console.error(e);
    }
  };

  const loadCourses = async () => {
    if (selectedInstitution) {
      console.log("loading " + selectedInstitution.courses.length + " courses");
      try {
        axios
          .get(`${COURSES_URL}/${id}`, {
            headers: new Headers({
              Accept: "application/json",
            }),
            crossdomain: true,
          })
          .then((res) => {
            if (res.data.courses.length > 0) {
              console.log(res.data.courses);
              setCourses(res.data.courses);
            }
          });
      } catch (e) {
        setCourses(null);
        console.error(e);
      }
    }
  };

  useEffect(() => {
    loadSelectedInstitution();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [selectedInstitution]);

  if (!selectedInstitution) {
    return <div>Loading...</div>;
  }

  const addCourseTapped = () => {
    console.log("add course tapped");
    history.push({
      pathname: "/add-course/" + id + "/" + selectedInstitution.name,
    });
  };

  return (
    <div>
      <div className={styles.row}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          aria-label="add-rating"
          className={classes.addCourseBtn}
          onClick={addCourseTapped}
        >
          Add Course
        </Button>
        <div
          className={styles.col}
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <h1 style={{ display: "inline-block" }}>
            {selectedInstitution.name}
          </h1>
          <Paper style={{ display: "inline-block" }} className={styles.paper}>
            <styles.H3>
              Average Rating: <br />
              {selectedInstitution.averageRating}
            </styles.H3>
          </Paper>
        </div>
      </div>
      <div>{renderCourseCards()}</div>
    </div>
  );
}

export default InstitutionInfo;
