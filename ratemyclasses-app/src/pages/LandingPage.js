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

/*eslint-disable */
const INSTITUTIONS_URL = process.env.INSTITUTIONS_URL || 'http://localhost:5000/institutions';
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
const row = css`
  display: flex;
  flex-flow: row wrap;
  flex: 0 1 auto;
  padding: 5px 10px;
  margin-bottom: 35px;
`;

// const header = css`
//   margin-bottom: 40px;
// `;

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
}));

function LandingPage() {

	const [page, setPage] = React.useState(0);
	const [institutions,setInstitutions] = React.useState([]);
	const [setIsLoading] = React.useState(true);
	const [state, setState] = React.useState({
		schoolName: '',
	});
	
	// const loadMoreInst = () => {
	// 	setPage(page + 1);
	// };

	React.useEffect(() => {
		fetch(
		 // `http://localhost:5000/institutions?page=${page}`,
		  `${INSTITUTIONS_URL}?page=${page}`,
		  {
				method: 'GET',
				headers: new Headers({
			  Accept: 'application/json'
				})
		  }
		)
		  .then(res => res.json())
		  .then(response => {
				setInstitutions(response.institutions);
				console.log(response.institutions);
				setIsLoading(false);
				setState(response.institutions[0].name);
		  })
		  .catch(error => console.log(error));
	  }, [page]);

	const handleChange = (event) => {
		const name = event.target.name;
		setState({
			...state,
			[name]: event.target.value,
		});
	};

	const classes = useStyles();

	const renderRows = institutions.map((institution) => {
		var name = institution.name;
		if (name === state.schoolName) {
			return institution.courses.map((course) => {
				return (
					<TableRow key={institution.name}>
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

	const renderWebsiteDescription = () => {
		return (
			<div className={row}>
				<div className={col}>
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
					{institutions.map((institution) => {
						return (
							<option key={institution.name} value={institution._id}>
								{institution.name}
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
			{renderWebsiteDescription()}
		</div>
	);
}

export default LandingPage;
