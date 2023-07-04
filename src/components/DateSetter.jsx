import { Typography } from "@mui/material";

function DateSetter({ date, variant, component, text }) {
  const newDate = new Date(date);

  if (variant === "inline") {
    return (
      <Typography
        component={component}
        variant="caption"
      >{`${text} ${newDate.getDate()}/${
        newDate.getMonth() + 1
      }/${newDate.getFullYear()}`}</Typography>
    );
  } else
    return (
      <Typography
        variant="caption"
        display="block"
        component={component}
      >{`${text} ${newDate.getDate()}/${
        newDate.getMonth() + 1
      }/${newDate.getFullYear()}`}</Typography>
    );
}

export default DateSetter;
