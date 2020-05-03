import React, { useEffect, useState } from "react";
import axios from "axios";
import { NativeSelect } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { schools } from "../dummyData/schools";
import { Link } from "react-router-dom";
import * as styles from "./pageStyles.styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

function LandingPage() {
  const [state, setState] = React.useState({
    schoolName: null,
  });

  const [institutions, setInstitutions] = useState([]);

  const loadInstitutions = async () => {
    console.log("loading institutions...");
    try {
      axios
        .get("http://localhost:5000/institutions/", { crossdomain: true })
        .then((res) => {
          if (res.data.length > 0) {
            console.log("got response: " + res.data);
            setInstitutions(res.data);
          }
        });
    } catch (e) {
      setInstitutions([]);
      console.error(e);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };
  const classes = useStyles();

  const renderRows = institutions.map((school) => {
    if (school.name === state.schoolName) {
      return school.courses.map((course) => {
        return (
          <TableRow key={school.name}>
            <TableCell align="left">
              <Link to={"/courseInfo/" + course.id}>{course.title}</Link>
            </TableCell>
            <TableCell align="right">{course.averageRating}</TableCell>
            <TableCell align="right">{course.averageDifficulty}</TableCell>
            <TableCell align="right">{course.averageHoursPerWeek}</TableCell>
            <TableCell align="right">
              <a href="">View</a>
            </TableCell>
          </TableRow>
        );
      });
    }
  });

  const renderWebsiteDescription = () => {
    return (
      <div className={styles.row}>
        <div className={styles.col}>
          <h1>Our Mission</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisi
            porta lorem mollis aliquam ut. Dictum varius duis at consectetur
            lorem donec. Tortor pretium viverra suspendisse potenti nullam ac
            tortor vitae. Pellentesque habitant morbi tristique senectus et
            netus et malesuada. Vitae nunc sed velit dignissim sodales. Commodo
            sed egestas egestas fringilla phasellus faucibus. Est ultricies
            integer quis auctor elit sed vulputate. Elit duis tristique
            sollicitudin nibh sit amet. Aenean sed adipiscing diam donec
            adipiscing tristique risus nec feugiat. Ut tristique et egestas quis
            ipsum suspendisse ultrices. Turpis cursus in hac habitasse platea.
            Dignissim convallis aenean et tortor at. Id eu nisl nunc mi ipsum
            faucibus vitae aliquet. Id diam maecenas ultricies mi eget mauris
            pharetra et ultrices. Sed id semper risus in hendrerit gravida.
          </p>
        </div>
      </div>
    );
  };

  const renderSchoolSelect = () => {
    return (
      <div className={styles.row}>
        <div className={styles.col}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="school-name">School Name</InputLabel>
            <NativeSelect
              value={state.schoolName}
              onChange={handleChange}
              inputProps={{
                name: "schoolName",
                id: "school-name",
              }}
            >
              {institutions.map((school) => {
                return (
                  <option key={school.name} value={school.name}>
                    {school.name}
                  </option>
                );
              })}
            </NativeSelect>
          </FormControl>
        </div>
      </div>
    );
  };

  const renderSchoolTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Course Name</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Difficulty</TableCell>
              <TableCell align="right">Hours Per Week</TableCell>
              <TableCell align="right">Reviews</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className={styles.body}>
      {renderSchoolSelect()}
      {/* {renderSchoolTable()}
      {renderWebsiteDescription()} */}
    </div>
  );
}

export default LandingPage;
