/* eslint-disable */
import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

const faces = [
  "http://i.pravatar.cc/300?img=6",
  "http://i.pravatar.cc/300?img=7",
  "http://i.pravatar.cc/300?img=8",
  "http://i.pravatar.cc/300?img=9",
];

function CourseCard({ course: course, institutionId: institutionId }) {
  const history = useHistory();

  console.log(history);
  const getRatingStars = () => {
    var emptyStars = Math.floor(5 - course.averageRating);
    var stars = [];
    for (var i = 0; i < course.averageRating; i++) {
      stars.push(<Icon className={"MuiIcon--starred"}>star_rounded</Icon>);
    }
    for (var i = 0; i < emptyStars; i++) {
      stars.push(<Icon>star_rounded</Icon>);
    }

    return (
      <div>
        {stars.map((value, index) => {
          return value;
        })}
      </div>
    );
  };

  const goToCoursePage = () => {
    history.push("/course-info/" + institutionId + "/" + course._id);
  };

  return (
    <Card
      className={"MuiReviewCard--01"}
      onClick={goToCoursePage}
      style={{ cursor: "pointer" }}
    >
      <CardMedia
        component={"img"}
        className={"MuiCardMedia-root"}
        src={"https://cdn.asla.org/uploadedImages/CMS/Shop/Bookstore/books.jpg"}
      />
      <CardContent className={"MuiCardContent-root"}>
        <div className={"ContentHead"}>
          <Typography
            className={"MuiTypography--heading"}
            variant={"h6"}
            gutterBottom
          >
            <h3 style={{color: '#1d8cab'}}>{course.courseID}</h3>
            {course.title}
          </Typography>
        </div>
        <div className={"ContentRating"}>{getRatingStars()}</div>
        {/* <Typography gutterBottom color={"textSecondary"}>
          Talking about travelling or new jobs, many people often think of
          change of environment...
        </Typography>
        <div className={"ContentTail"}>
          {faces.map((face) => (
            <Avatar className={"MuiAvatar-root"} key={face} src={face} />
          ))}
          <Typography
            className={"MuiTypography--reviewer"}
            color={"textSecondary"}
          >
            +420
          </Typography>
          <IconButton className={"MuiIconButton-root"}>
            <Icon>more_horiz</Icon>
          </IconButton>
        </div> */}
      </CardContent>
    </Card>
  );
}

export default CourseCard;
