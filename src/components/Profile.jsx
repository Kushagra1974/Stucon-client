import {
  List,
  Box,
  ListItem,
  ListItemText,
  Typography,
  Container,
} from "@mui/material";

import { useParams } from "react-router-dom";
import { useEffect } from "react";

import useSendRequest from "../Hooks/useSendRequest";
function Profile() {
  let { profileId } = useParams();

  const [userDetails, userDetailsLoading, , fetchUserDetails] =
    useSendRequest(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    fetchUserDetails({
      url: `${
        import.meta.env.VITE_SERVER_URL
      }/user/get-user-info/${userId}/${profileId}`,
      method: "GET",
    });
  }, [profileId]);

  return (
    <>
      {userDetailsLoading && <Typography>Loading ...</Typography>}
      {userDetails && (
        <Box
          sx={{
            border: "2px solid #1976d2",
            margin: "20px",
            borderRadius: "3px",
          }}
        >
          <Typography
            color="white"
            variant="h6"
            sx={{ background: "#1976d2", paddingLeft: "20px" }}
          >{`${userDetails.userName.toUpperCase()}`}</Typography>
          <Container>
            <Typography>
              {`Education Institute : ${userDetails.educationInstitute}`}
            </Typography>
            <Typography>{`Employer : ${userDetails.employer}`}</Typography>

            {userDetails.email && (
              <Typography>{`Email : ${userDetails.email}`}</Typography>
            )}
          </Container>
        </Box>
      )}
    </>
  );
}

export default Profile;
