import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  ListGroup,
} from "flowbite-react";
import React from "react";

import { FaCheck, FaTimes } from "react-icons/fa";

import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  const [showUsers, setShowUsers] = useState(true);

  const [showModel, setShowModel] = useState(false);

  const [userIdToDelete, setUserIdToDelete] = useState(null);



  const { currentUser } = useSelector((state) => state.user);

  console.log(users.length)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/users/getusers`);

        const data = await res.json();

        if (data.users.length < 9) {
          setShowUsers(false);
        }

        if (res.ok) {
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    try {
      const startIndex = users.length;

      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);

      const data = await res.json();
      console.log(data)

      console.log("Data Users", data.users);

      console.log(res.ok);

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
      }
      if (data.users.length < 9) {
        setShowUsers(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleDeletePost = async () => {

  //   console.log("Handle Delete Post Clicked!!");
  //   try {
  //     setShowModel(false);
  //     const res = await fetch(
  //       `/api/post/deletepost/${currentUser._id}/${postIdToDelete}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     const data = await res.json();

  //     if (!res.ok) {
  //       console.log(data.message);
  //     } else {
  //       setUserPosts((prev) =>
  //         prev.filter((post) => post._id !== postIdToDelete)
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleDeleteUser = async () => {
    try {
      setShowModel(false);
      const res = await fetch(`/api/users/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>

              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {users?.map((user, id) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={id}
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <img
                      src={user.photoURL}
                      alt={user.username}
                      className="w-10 h-10 object-cover rounded-full  border-black border-2"
                    />
                  </Table.Cell>

                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setUserIdToDelete(user._id);
                      }}
                      className="text-red-800 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showUsers && (
            <button
              onClick={handleShowMore}
              className="w-full mx-auto mt-2 text-teal-500 font-bold hover:text-teal-300"
            >
              Show More...
            </button>
          )}
        </>
      ) : (
        <p> You don't have the users </p>
      )}

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
              Are you sure want to delete your User?
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

export default Users;
