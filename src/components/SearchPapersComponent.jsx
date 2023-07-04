import { useState, useEffect } from "react";

import useGlobalState from "../Hooks/useGlobalState";
import {
  Stack,
  Typography,
  IconButton,
  Button,
  MenuItem,
  ListItemText,
  ListItemIcon,
  MenuList,
  Grid,
  Divider,
  Container,
} from "@mui/material";

import ModalComponent from "./ModalComponent";

import IosShareIcon from "@mui/icons-material/IosShare";
import DeleteIcon from "@mui/icons-material/Delete";

import useSendRequestAndAuth from "../Hooks/useSendRequestAndAuth";
import useSendRequest from "../Hooks/useSendRequest";

import SelectComponent from "./SelectComponent";

import { useNavigate, useParams } from "react-router-dom";

import useSocket from "../Hooks/useSocket";

function SearchPapersComponents() {
  const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
  const socket = useSocket();
  const [
    fileUploadResponse,
    fileLodingStatus,
    fileErrorStatus,
    sendFilesAndVerify,
  ] = useSendRequestAndAuth(null);
  const [categories, , , getCategories] = useSendRequest([]);
  const [categoryImages, , , getCategoryImages, setCategoryImages] =
    useSendRequest({});

  const [globalState, setGlobalState] = useGlobalState();
  const [imgSrc, setImgSrc] = useState("");
  const [files, setFiles] = useState({});
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);

  const getCategoryName = (name) => {
    setCategoryName(name);
  };
  let { category, id } = useParams();
  const getCategoryFromShowPaper = (name) => {
    navigate(`/searchpapers/${name}`);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("stucon"))?.token;
    const userId = JSON.parse(localStorage.getItem("stucon")).user._id;
    const uploadedFile = new FormData();
    for (let i in files) {
      uploadedFile.append("file", files[i]);
    }
    uploadedFile.append("filename", categoryName);
    if (Object.keys(files).length > 0 && categoryName !== "") {
      await sendFilesAndVerify({
        url: `${import.meta.env.VITE_SERVER_URL}/upload/${userId}`,
        body: uploadedFile,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
      });
      if (fileUploadResponse) {
        if (categoryName === category) {
          // console.log(1, fileUploadResponse);
          setCategoryImages((prev) => {
            return {
              ...prev,
              images: [...prev.images, ...fileUploadResponse.urls],
            };
          });
        } else
          setGlobalState({
            ...globalState,
            isAlert: true,
            alertMessage: fileUploadResponse.message,
          });
        setFiles({});
      }
    } else {
      setGlobalState({
        ...globalState,
        isAlert: true,
        alertMessage: "Filename and file both are required",
      });
    }
  };

  const handelFileUpload = (e) => {
    const fileList = e.target.files;
    const len = fileList.length;
    const fileObj = {};
    for (let i = 0; i < len; i++) {
      fileObj[fileList[i].name] = fileList[i];
    }
    setFiles((prev) => {
      return { ...prev, ...fileObj };
    });
  };

  const handelButtonClick = (filename) => {
    let obj = {};
    for (let file in files) {
      if (file !== filename) {
        obj[file] = files[file];
      }
    }
    setFiles({ ...obj });
  };

  useEffect(() => {
    getCategories({
      url: `${import.meta.env.VITE_SERVER_URL}/upload/categories`,
      method: "GET",
    });
  }, []);

  useEffect(() => {
    if (category && id) {
      getCategoryImages({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/upload/categories/images/${category}/${id}`,
        method: "GET",
      });
    } else if (category) {
      getCategoryImages({
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/upload/categories/images/${category}`,
        method: "GET",
      });
    }
  }, [category]);

  return (
    <Stack>
      <form onSubmit={submitHandler}>
        <Stack
          spacing={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={2}
        >
          <Stack direction="row" spacing={1} display="flex" alignItems="center">
            <Typography variant="h5">Upload Paper</Typography>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handelFileUpload}
                multiple
              />
              <IosShareIcon />
            </IconButton>
          </Stack>
          <MenuList>
            {Object.keys(files).length !== 0 &&
              Object.keys(files).map((file) => (
                <MenuItem key={file} onClick={() => handelButtonClick(file)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText>{file}</ListItemText>
                </MenuItem>
              ))}
          </MenuList>
          <SelectComponent
            menuItems={categories.categories}
            menuName="Categories"
            getSelectedValue={getCategoryName}
            label="categories"
          />
          <Button
            variant="contained"
            sx={{ width: "fit-content" }}
            type="submit"
          >
            {fileLodingStatus === false ? "upload" : "uploading"}
          </Button>
        </Stack>
        <Divider></Divider>
      </form>
      <Stack
        spacing={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop={2}
      >
        <SelectComponent
          defaultValue={category}
          label="categories"
          menuItems={categories.categories}
          menuName="Show Papers"
          getSelectedValue={getCategoryFromShowPaper}
        />
        <Container>
          <Grid container spacing={2}>
            {categoryImages &&
              categoryImages.images &&
              categoryImages.images.length > 0 &&
              categoryImages.images.map((src, i) => (
                <Grid
                  key={i}
                  item
                  sm={6}
                  md={4}
                  onClick={() => {
                    setImgSrc(src);
                    setOpenModal(true);
                  }}
                >
                  <img
                    src={src}
                    alt={src}
                    width="100%"
                    height="100%"
                    style={{ objectFit: "contain" }}
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Stack>
      <ModalComponent openModal={openModal} setOpenModal={setOpenModal}>
        <Container
          sx={{
            width: "60vh",
            height: "60vh",
          }}
        >
          <img
            width="100%"
            src={imgSrc}
            alt="Inhanced-image"
            sx={{
              objectFit: "contain",
            }}
          />
        </Container>
      </ModalComponent>
    </Stack>
  );
}

export default SearchPapersComponents;
