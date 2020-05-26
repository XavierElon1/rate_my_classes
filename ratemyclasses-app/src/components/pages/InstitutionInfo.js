/*eslint-disable */
import React, { useEffect, useState } from "react";
// import { schools } from "../dummyData/schools";
import * as styles from "./pageStyles.styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {Button} from "@material-ui/core";
import Add from '@material-ui/icons/Add';
import axios from "axios";
import { useParams, useHistory } from "react-router-dom";
import CourseCard from "../tools/CourseCard";

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
      position: 'fixed',
    right: '10px',
    bottom: '10px'
    }
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
  const classes = useStyles();
  const [courses, setCourses] = useState([]);
  const history = useHistory();
  let { id } = useParams();
  
  console.log("got id from params " + id);

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

  const addCoursehandler = () => {
    history.push({pathname: '/rate-course', data: selectedInstitution})
  }

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

  return (
    <div>
      <div className={styles.row}>
        <div className={styles.col}>
          <h1>{selectedInstitution.name}</h1>
          <Paper className={styles.paper}>
            <styles.H3>
              Average Rating: {selectedInstitution.averageRating}
            </styles.H3>
          </Paper>
        </div>
      </div>
      <div>{renderCourseCards()}</div>
      <Button
        variant="contained"
        color="primary"
        size='small'
        className={classes.addCourseBtn}
        onClick={addCoursehandler}
        startIcon={<Add />}>
        Add Course
      </Button>
    </div>
  );
}

export default InstitutionInfo;
