import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateStart,
  updateSuccess,
  updateImageProfileURL,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice.js";

import { useDispatch } from "react-redux";

import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";

import { TextInput, Button, Alert, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const ProfileDashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadingProcess, setImageFileUploadingProcess] =
    useState(false);

  const [userUpdateText, setUserUpdateText] = useState(null);
  const [userUpdateFailText, setUserUpdateFailText] = useState(null);
  const [formData, setFormData] = useState({});

  const [showModel, setShowModel] = useState(false);

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const filePickerRef = useRef();
  // console.log(currentUser);

  const changeProfileImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      setImageFileURL(URL.createObjectURL(file));
    }
  };
  // console.log(profileImage, imageFileURL);

  useEffect(() => {
    if (profileImage) {
      uploadImage();
    }
  }, [profileImage]);

  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write : if
    //       request.resource.size > 2 *1024 *1024  &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    setImageFileUploadingProcess(true);
    setImageFileUploadError(null);
    setImageFileURL(null);
    setProfileImage(null);

    const storage = getStorage(app);

    const fileName = new Date().getTime() + profileImage.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, profileImage);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFileURL(null);
        setProfileImage(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
          setFormData({ ...formData, photoURL: downloadURL });
          setImageFileUploadingProcess(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  console.log(formData);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUserUpdateFailText(null);
    setUserUpdateText(null);

    if (imageFileUploadingProcess) {
      setUserUpdateFailText("User Already being updating...");
      return;
    }

    if (Object.keys(formData).length === 0) {
      setUserUpdateFailText("Enter Infromation to change");
      return;
    }

    try {
      const updatedFormData = { ...formData };
      if (imageFileURL) {
        updatedFormData.photoURL = imageFileURL;
      }
      dispatch(updateStart());

      const res = await fetch(`/api/users/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });

      if (imageFileURL) {
        dispatch(updateImageProfileURL(imageFileURL));
      }

      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUserUpdateFailText(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUserUpdateText("User's Profile Updated Successfully!!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUserUpdateFailText(error.message);
    }
  };

  console.log("FromData", formData);

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/users/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={changeProfileImage}
          ref={filePickerRef}
          hidden
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },

                path: {
                  stroke: `rgba(62,152,199,${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className={`w-full  border-8 border-[light-gray] rounded-full object-cover ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
            id="photoURL"
            src={imageFileURL ? imageFileURL : currentUser?.photoURL}
            alt="Profile Img"
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="**********"
          onChange={handleChange}
        />{" "}
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          className="medium tracking-widest"
        >
          Update
        </Button>
      </form>

      <div className="text-red-500 mt-4 font-medium flex justify-between">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          Delete Account
        </span>
        <span className="cursor-pointer">Sign Out</span>
      </div>

      <div>
        {userUpdateText && (
          <Alert color={"success"} className="mt-4">
            <p className="text-[15px] tracking-widest font-medium text-[dark-green]">
              {userUpdateText}
            </p>
          </Alert>
        )}

        {userUpdateFailText && (
          <Alert color={"failure"} className="mt-4">
            <p className="text-[15px] tracking-widest font-medium text-[dark-green]">
              {userUpdateFailText}
            </p>
          </Alert>
        )}
      </div>

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />

        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="text-lg text-gray-500 dark:text-gray-400">
              Are you sure want to delete your Account?
            </h3>

            <div className="flex gap-2 justify-center mt-4">
              <Button color={"failure"} onClick={handleDeleteUser}>
                Delete it.
              </Button>
              <Button color={"success"} onClick={() => setShowModel(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileDashboard;
