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

import { useState, useEffect } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Posts = () => {
  const [userPosts, setUserPosts] = useState([]);

  const [showPosts, setShowPosts] = useState(true);

  const [showModel, setShowModel] = useState(false);

  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  console.log(userPosts);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);

        const data = await res.json();

        if (data.posts.length < 9) {
          setShowPosts(false);
        }

        if (res.ok) {
          setUserPosts(data.posts);
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
      const startIndex = userPosts.length;

      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );

      const data = await res.json();

      console.log("Data Posts", data.posts);

      console.log(res.ok);

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
      }
      if (data.posts.length < 9) {
        setShowPosts(false);
      }

      console.log(userPosts);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    console.log("Handle Delete Post Clicked!!");
    try {
      setShowModel(false);
      const res = await fetch(
        `/api/post/deletepost/${currentUser._id}/${postIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {userPosts?.map((post, id) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={id}
                >
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-[gray]"
                      />
                    </Link>
                  </Table.Cell>

                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="text-red-800 font-medium hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>

                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <span className="text-teal-500 font-medium hover:underline cursor-pointer">
                        Edit
                      </span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {showPosts && (
            <button
              onClick={handleShowMore}
              className="w-full mx-auto mt-2 text-teal-500 font-bold hover:text-teal-300"
            >
              Show More...
            </button>
          )}
        </>
      ) : (
        <p> You don't have the posts </p>
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
              Are you sure want to delete your Post?
            </h3>

            <div className="flex gap-2 justify-center mt-4">
              <Button color={"failure"} onClick={handleDeletePost}>
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

export default Posts;
