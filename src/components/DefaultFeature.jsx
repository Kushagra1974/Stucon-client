import { Grid, Typography } from "@mui/material";

function DefaultFeature() {
  return (
    <Grid
      container
      margin={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ background: "#1dc3d8", opacity: 0.4 }}
      height="100%"
    >
      <Grid item>
        <Typography sx={{ flexGrow: 1, color: "white" }}>
          Hi welcome to StuCon. Enabling Student Connections
        </Typography>
      </Grid>
    </Grid>
  );
}

export default DefaultFeature;
