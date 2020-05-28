/*eslint-disable */
import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import styled from "react-emotion";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import logo from "./tools/img/logo.png";
import { useHistory, useLocation } from "react-router-dom";
// import Modal from "@material-ui/core/Modal";

const Image = styled("img")`
  background-image: url("./tools/img/logo.png");
  width: 166px;
`;

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

var styles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  barTitle: {
    // flexGrow: 1,
    whiteSpace: "nowrap",
    textAlign: "left",
    marginRight: "20px",
    cursor: "pointer",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.primary.light, 0.6),
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.light, 0.8),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
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
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  button: {
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.light, 1),
    },
  },
}));

export default function RMCAppBar() {
  const classes = styles();
  const history = useHistory();
  const location = useLocation();
  const goGome = () => {
    if (location.pathname === "/") {
      window.location.reload();
    } else {
      history.push("/");
    }
  };

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const renderLoginModal = () => {

  //   return ()
  // }

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {/* <Typography variant="h6" >
            Rate My Classes
          </Typography> */}
          <Image
            src={logo}
            alt="logo"
            className={classes.barTitle}
            onClick={goGome}
          />
          <div className={classes.grow} />
          {/* <Button color="inherit" className={classes.button}>
            Login
          </Button>
          <Button color="inherit" className={classes.button}>
            Sign Up
          </Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
