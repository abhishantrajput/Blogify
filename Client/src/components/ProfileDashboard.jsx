import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";

import { TextInput, Button, Alert } from "flowbite-react";
import { root } from "postcss";
const ProfileDashboard = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFileURL, setImageFileURL] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  console.log(imageFileUploadProgress, imageFileUploadError);

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

    setImageFileUploadError(null);
    setImageFileURL(null)
    setProfileImage(null)

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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileURL(downloadURL);
        });
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center  ">Profile</h1>

      <form className="flex flex-col gap-4">
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
            src={imageFileURL ? imageFileURL : currentUser.photoURL}
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
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="**********" />

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
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default ProfileDashboard;
