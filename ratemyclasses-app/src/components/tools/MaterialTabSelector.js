import React from 'react';
import PropTypes from 'prop-types';
import {
	makeStyles,
	ThemeProvider,
	createMuiTheme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {css} from 'react-emotion';
import {withStyles} from '@material-ui/core/styles';
/*eslint-disable */

const tabItem = css`
  border: 0.5px solid #f1f1f1;
  background: white;
`;

const container = css`
  padding: 0px;
  border-radius: 0px;
  box-shadow: none;
  height: 370px;

  @media only screen and (min-width: 768px) {
    height: 370px;
    background-color: #fff;
    margin-top: 10px;
    position: relative;
    padding: 1em;
    border-radius: 5px;
    margin-bottom: 3em;
    margin-top: 1em;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  }
`;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFF",
    },
  },
});

function TabPanel(props) {
  const { children, value, index, onClick, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      style={{ textAlign: "-webkit-center" }}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTab = withStyles({
  selected: {
    backgroundColor: "#10aec9",
    // color: "white",
  },
  textColorSecondary: {
    color: "#FFFFFF",
  },
})(Tab);

export default function MaterialTabSelector({ tabs }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={container}>
        <AppBar
          position="static"
          color="default"
          style={{ marginBottom: "25px" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="#88d1d4"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs"
          >
            {tabs.map((tab, index) => {
              const { text } = tab;
              return (
                <StyledTab
                  label={text}
                  key={index}
                  {...a11yProps(index)}
                  style={{
                    border: "0.5px solid #616060",
                  }}
                />
              );
            })}
          </Tabs>
        </AppBar>

        {tabs.map((tab, index) => {
          const { tabComponent } = tab;
          return (
            <TabPanel value={value} index={index}>
              {tabComponent}
            </TabPanel>
          );
        })}
      </div>
    </ThemeProvider>
  );
}
