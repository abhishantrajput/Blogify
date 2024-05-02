import React from "react";
import { useSelector } from "react-redux";

import { TextInput, Button } from "flowbite-react";
const ProfileDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-3xl font-semibold text-center  ">Profile</h1>

      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            className="w-full  border-8 border-[light-gray] rounded-full object-cover"
            src={currentUser.photoURL}
            alt="Profile Img"
          />
        </div>

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

      <div className="text-[red] mt-2 font-medium flex justify-between">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default ProfileDashboard;
