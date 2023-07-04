import { Stack } from "@mui/material";

function RightSideBar({ children, navigationOpen }) {
  return (
    <Stack
      spacing={1}
      sx={{
        width: {
          sm: "100vw",
          xs: "100vw",
        },
        marginLeft: {
          sm: "0",
          xs: "0",
          md: navigationOpen ? "20vw" : "0",
        },
        transition: "margin 0.5s",
        padding: 0,
        paddingTop: "4rem",
      }}
    >
      {children}
    </Stack>
  );
}

export default RightSideBar;
