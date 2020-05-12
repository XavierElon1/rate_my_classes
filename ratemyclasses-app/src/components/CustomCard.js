import Avatar from '@material-ui/core/Avatar/Avatar';

/* eslint-disable */
import React from "react";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";

const faces = [
  "http://i.pravatar.cc/300?img=6",
  "http://i.pravatar.cc/300?img=7",
  "http://i.pravatar.cc/300?img=8",
  "http://i.pravatar.cc/300?img=9",
];

function CustomCard({ institution: institution }) {
  // console.dir(institution);
  return (
    <Card className={"MuiReviewCard--01"}>
      <CardMedia
        component={"img"}
        className={"MuiCardMedia-root"}
        src={
          "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80"
        }
      />
      <CardContent className={"MuiCardContent-root"}>
        <div className={"ContentHead"}>
          <Typography
            className={"MuiTypography--heading"}
            variant={"h6"}
            gutterBottom
          >
            {institution.name}
          </Typography>
          <IconButton className={"MuiIconButton-root"}>
            <Icon>favorite</Icon>
          </IconButton>
        </div>
        <Typography
          className={"MuiTypography--subheading"}
          color={"textSecondary"}
          gutterBottom
        >
          <Icon className={"MuiIcon--text"}>location_on</Icon> Rome
        </Typography>
        <Typography
          className={"MuiTypography--subheading"}
          color={"textSecondary"}
          gutterBottom
        >
          <a href={institution.website}>
            <Icon className={"MuiIcon--text"} style={{ fontSize: "20px" }}>
              http
            </Icon>
          </a>
        </Typography>
        <div className={"ContentRating"}>
          <Icon className={"MuiIcon--starred"}>star_rounded</Icon>
          <Icon className={"MuiIcon--starred"}>star_rounded</Icon>
          <Icon className={"MuiIcon--starred"}>star_rounded</Icon>
          <Icon className={"MuiIcon--starred"}>star_rounded</Icon>
          <Icon>star_rounded</Icon>
          <Typography className={"MuiTypography--rating"} inline>
            {institution.averageRating}
          </Typography>
        </div>
        <Typography gutterBottom color={"textSecondary"}>
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
        </div>
      </CardContent>
    </Card>
  );
}

export default CustomCard;
