import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {css} from 'react-emotion';
import {makeStyles} from '@material-ui/core/styles';
import CustomCard from '../CustomCard';
import InputBase from '@material-ui/core/InputBase';
import Spinner from '../tools/Spinner';
import Pagination from '@material-ui/lab/Pagination';
import SearchIcon from '@material-ui/icons/Search';

/*eslint-disable */
const INSTITUTIONS_URL =
  process.env.REACT_APP_INSTITUTIONS_URL ||
  "http://localhost:5000/institutions";
/*eslint-disable */

const body = css`
  * {
    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }
  }
  height: 100%;
  font-family: "Roboto";
  padding-top: 0.1px;
`;
// classes
const wrapper = css`
  width: 1200px;
  margin: 0 auto;
  float: none;
  background-color: #fff;
`;
const row = css`
  display: flex;
  flex-flow: row wrap;
  flex: 0 1 auto;
  padding: 5px 10px;
  margin-bottom: 35px;
`;

const col = css`
  flex: 0 0 92%;
  margin: auto 4%;
  @media only screen and (min-width: 480px) {
    margin-left: 4%;
    margin-right: 0%;
    text-align: center;
  }
`;

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
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    // backgroundColor: fade(theme.palette.primary.light, 0.6),
    // "&:hover": {
    //   backgroundColor: fade(theme.palette.primary.light, 0.8),
    // },
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

function LandingPage() {
  const [page, setPage] = useState(0);
  const [institutions, setInstitutions] = useState(null);
  const [search, setSearch] = useState("");
  const [searchComplete, setSearchComplete] = useState(false);
  const [pageCount, setPageCount] = useState(93);
  if (search) console.log("searching...with search term: " + search);
  if (!search) console.log("search inactive.");

  const loadInstitutions = async () => {
    console.log("loading page: " + page);
    try {
      axios
        .get(`${INSTITUTIONS_URL}?page=${page}`, {
          headers: new Headers({
            Accept: "application/json",
          }),
          crossdomain: true,
        })
        .then((res) => {
          if (res.data.institutions.length > 0) {
            // console.log(res.data);
            // console.log("got default results. # of pages is ");
            // console.log(Math.round(res.data.institutions.length / 100));
            // setPageCount(res.data.institutions.length / 100);
            setInstitutions(res.data.institutions);
          }
        });
    } catch (e) {
      setInstitutions([]);
      console.error(e);
    }
  };

  const filterInstitutions = async () => {
    console.log("filtering...");
    if (search != "" && search.length > 2) {
      console.log("filtering with search term: " + search);
      try {
        axios
          .get(`${INSTITUTIONS_URL}?filter=${search}`, {
            headers: new Headers({
              Accept: "application/json",
            }),
            crossdomain: true,
          })
          .then((res) => {
            if (res.data.length > 0) {
              console.log("got filtered results. # of pages is ");
              console.log(Math.round(res.data.length / 100));
              setPageCount(Math.round(res.data.length / 100));
              setInstitutions(res.data);
              setSearchComplete(true);
            }
          });
      } catch (e) {
        setInstitutions([]);
        console.error(e);
      }
    }
  };

  useEffect(() => {
    filterInstitutions();
  }, [search]);

  useEffect(() => {
    loadInstitutions();
  }, [page]);

  const handleChange = (event, value) => {
    var calc = value - 1;
    if (page != calc) {
      setInstitutions(null);
    }

    setPage(value - 1);
  };

  const handleSearchChange = (event) => {
    setSearchComplete(false);
    if (event.target.value != "" && event.target.value.length > 2) {
      setSearch(event.target.value);
      setInstitutions(null);
    } else if (event.target.value === "") {
      setInstitutions(null);
      setPageCount(93);
      loadInstitutions();
    } else {
      setPageCount(93);
      setSearch("");
    }
    console.log(event.target.value);
  };

  const classes = useStyles();

  const renderInstitutionCard = () => {
    if (!institutions) {
      return <Spinner />;
    } else {
      return (
        <React.Fragment>
          {institutions.map((institution) => {
            return (
              <div
                key={institution._id}
                style={{ display: "inline-block", margin: "4em 1em" }}
              >
                <CustomCard institution={institution}></CustomCard>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
  };

  return (
    <div className={body}>
      <div className={wrapper}>
        <div
          style={{ display: "flex", justifyContent: "center", margin: "1em" }}
        >
          <Pagination
            count={pageCount}
            page={page + 1}
            onChange={handleChange}
          />
        </div>

        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Oregon State University…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={handleSearchChange}
          />
        </div>
        {search && !searchComplete ? <p>searching...</p> : null}
        {search && searchComplete ? <p>search complete!</p> : null}

        <div>{renderInstitutionCard()}</div>
      </div>
    </div>
  );
}

export default LandingPage;
