/*eslint-disable */
import React, { useEffect, useState } from "react";
import * as styles from "./pageStyles.styles";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import { useParams } from "react-router-dom";
import CourseCard from "../tools/CourseCard";
import { Button } from "@material-ui/core";
import Create from "@material-ui/icons/Create";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Spinner from '../tools/Spinner';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "../tools/AnimatedProgressProvider";

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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px #0D7FA1 solid",
    margin: "auto",
    width: "500px",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    marginLeft: "55px",
    width: "89%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create("width"),
    width: "100%",
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
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchComplete, setSearchComplete] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [showSuccessAlert, setShowSuccessAlert] = useState(location.state && (location.state.showSuccessAlert === true) ? true : false);

  if (search) console.log("searching...with search term: " + search);
  if (!search) console.log("search inactive.");

  let { id } = useParams();
  console.log("institution info page got institution id from params " + id);

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

  const renderCourseCards = () => {
    if (!courses) {
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

  const filterCourses = async () => {
    if (search != "" && search.length > 2) {
      try {
        axios
          .get(`${COURSES_URL}/${id}?filter=${search}&page=${page}`, {
            headers: new Headers({
              Accept: "application/json",
            }),
            crossdomain: true,
          })
          .then((res) => {
            if (res) {
              console.log(res);
              setPageCount(res.data.pages);
              setCourses(res.data.courses);
              setSearchComplete(true);
            }
          });
      } catch (e) {
        setCourses([]);
        console.error(e);
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      filterCourses();
    }, 3000);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    loadSelectedInstitution();
  }, []);

  useEffect(() => {
    loadCourses();
  }, [selectedInstitution]);

  if (!selectedInstitution) {
    return <div>Loading...</div>;
  }

  const handleChange = (event, value) => {
    console.log(value);
    var calc = value - 1;
    console.log("handling change on page change");
    console.log(calc);
    if (page != calc) {
      setCourses(null);
    }

    setPage(value - 1);
    console.log("This is page: ");

    console.log(page);
  };

  const addCourseTapped = () => {
    history.push({
      pathname: "/add-course/" + id + "/" + selectedInstitution.name
    });
  };

  const handleSnackBarClose = () => {
    setShowSuccessAlert(false);
    history.replace({ state: {showSuccessAlert: false} });
  };

  const handleSearchChange = (event) => {
    console.log("*****SEARCH FIELD CHANGED");
    setPage(0);
    setSearchComplete(false);
    if (event.target.value != "" && event.target.value.length > 2) {
      setSearch(event.target.value);
      setCourses(null);
    } else if (event.target.value === "") {
      setCourses(null);
      loadCourses();
    } else {
      setSearch("");
    }
    console.log(event.target.value);
  };

  const percentage = (selectedInstitution.averageRating / 5) * 100;

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
          <div style={{ width: "150px" }}>
            <h4>Average Rating</h4>
            <AnimatedProgressProvider
              valueStart={0}
              valueEnd={percentage}
              duration={0.5}
              easingFunction={easeQuadInOut}
            >
              {(value) => {
                return (
                  <CircularProgressbar
                    value={value}
                    text={`${selectedInstitution.averageRating}/5`}
                    styles={buildStyles({
                      strokeLinecap: "round",
                      textSize: "16px",
                      pathTransition: "none",
                      pathColor: `rgba(13, 127, 161, ${percentage / 100})`,
                      textColor: "#212121",
                      trailColor: "#d6d6d6",
                      backgroundColor: "#3e98c7",
                    })}
                  />
                );
              }}
            </AnimatedProgressProvider>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", margin: "1em" }}>
        <Pagination count={pageCount} page={page + 1} onChange={handleChange} />
      </div>

      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          placeholder="Search Courses…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={handleSearchChange}
          type="search"
        />
      </div>
      {search && !searchComplete ? <p>searching...</p> : null}
      {search && searchComplete ? <p>search complete!</p> : null}
      <div>{renderCourseCards()}</div>
      <Snackbar 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={showSuccessAlert} transitionDuration={500}>
          <Alert severity="success" onClose={handleSnackBarClose}>
            Your course have been successfully added!
          </Alert>
        </Snackbar>
    </div>
  );
}

export default InstitutionInfo;
