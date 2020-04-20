import React from 'react';
import {css} from 'react-emotion';
import {NativeSelect} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {schools} from '../dummyData/schools';

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
  margin: 0;
  padding-top: 0.1px;
`;
// classes
// const wrapper = css`
//   width: 100%;
//   margin: 0 auto;
//   float: none;
//   background-color: #fff;
// `;
// const row = css`
//   display: flex;
//   flex-flow: row wrap;
//   flex: 0 1 auto;
//   padding: 5px 10px;
//   margin-bottom: 35px;
// `;

// const header = css`
//   margin-bottom: 40px;
// `;

// const col = css`
//   flex: 0 0 92%;
//   margin: auto 4%;
//   @media only screen and (min-width: 480px) {
//     margin-left: 4%;
//     margin-right: 0%;
//     text-align: center;
//   }
// `;

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
		schoolName: schools[0].name,
	});

	const handleChange = (event) => {
		const name = event.target.name;
		setState({
			...state,
			[name]: event.target.value,
		});
	};
	const classes = useStyles();

	const renderRows = schools.map((school) => {
		if (school.name === state.schoolName) {
			return school.courses.map((course) => {
				return (
					<TableRow key={school.name}>
						<TableCell align='left'>{course.title}</TableCell>
						<TableCell align='right'>{course.averageRating}</TableCell>
						<TableCell align='right'>{course.averageDifficulty}</TableCell>
						<TableCell align='right'>{course.averageHoursPerWeek}</TableCell>
						<TableCell align='right'>
							<a href=''>View</a>
						</TableCell>
					</TableRow>
				);
			});
		}
	});

	const renderSchoolSelect = () => {
		return (
			<FormControl className={classes.formControl}>
				<InputLabel htmlFor='school-name'>School Name</InputLabel>
				<NativeSelect
					value={state.schoolName}
					onChange={handleChange}
					inputProps={{
						name: 'schoolName',
						id: 'school-name',
					}}
				>
					{schools.map((school) => {
						return (
							<option key={school.name} value={school.name}>
								{school.name}
							</option>
						);
					})}
				</NativeSelect>
			</FormControl>
		);
	};

	const renderSchoolTable = () => {
		return (
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label='simple table'>
					<TableHead>
						<TableRow>
							<TableCell>Course Name</TableCell>
							<TableCell align='right'>Rating</TableCell>
							<TableCell align='right'>Difficulty</TableCell>
							<TableCell align='right'>Hours Per Week</TableCell>
							<TableCell align='right'>Reviews</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{renderRows}</TableBody>
				</Table>
			</TableContainer>
		);
	};

	return (
		<div className={body}>
			{renderSchoolSelect()}
			{renderSchoolTable()}
		</div>
	);
}

export default LandingPage;
