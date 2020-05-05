/*eslint-disable */
export default ({ spacing, palette }) => ({
  MuiCard: {
    root: {
      "&.MuiReviewCard--01": {
        marginBottom: 200,
        maxWidth: 304,
        margin: "auto",
        overflow: "initial",
        position: "relative",
        transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
        boxShadow: "none",
        borderRadius: 0,
        "&:hover": {
          "& .MuiTypography--explore": {
            transform: "scale(1.2)",
          },
        },
        "& button": {
          marginLeft: 0,
        },
        "& .MuiCardMedia-root": {
          height: "100%",
        },
        "& .MuiCardContent-root": {
          boxShadow: "0 16px 40px -12.125px rgba(0,0,0,0.3)",
          borderRadius: spacing(0.5),
          margin: `0 ${spacing(2)}px`,
          backgroundColor: "#ffffff",
          position: "absolute",
          top: "60%",
          padding: spacing(3),
          textAlign: "left",
          "& .ContentHead": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          },
          "& .MuiIcon--text": {
            fontSize: 14,
            color: palette.grey[500],
          },
          "& .ContentRating": {
            marginBottom: spacing(0.5),
            "& svg, .material-icons": {
              fontSize: 20,
              color: palette.grey[300],
            },
            "& .MuiIcon--starred": {
              color: "#ffbb00",
            },
            "& .MuiTypography--rating": {
              verticalAlign: "top",
              fontWeight: "bold",
              fontSize: 16,
              marginLeft: spacing(2),
              display: "inline-block",
            },
          },
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            display: "inline-block",
            border: "2px solid white",
            "&:not(:first-of-type)": {
              marginLeft: -spacing(1) * 1.5,
            },
          },
          "& .ContentTail": {
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            "& .MuiTypography--reviewer": {
              marginLeft: spacing(1),
              marginRight: "auto",
            },
          },
        },
        "& .MuiIconButton-root": {
          padding: spacing(1),
        },
      },
    },
  },
});
