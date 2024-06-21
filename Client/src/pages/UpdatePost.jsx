import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(`Fetch post failed: ${data.message}`);
          setPublishError(data.message);
        } else {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      } catch (error) {
        console.error(`Error fetching post: ${error.message}`);
        setPublishError("Failed to fetch the post.");
      }
    };
    fetchPost();
  }, [postId]);

  const handleFileUpload = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.error(`Upload failed: ${error.message}`);
          setImageUploadError("Something went wrong during the upload");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      console.error(`Error uploading image: ${error.message}`);
      setImageUploadError("Image failed to upload");
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPublishError(null);
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Update API response data:", data);
      if (!res.ok) {
        setPublishError(data.message);
      } else {
        setPublishError(null);
        if (data.slug) {
          navigate(`/posts/${data.slug}`);
        }
      }
    } catch (error) {
      console.error(`Error updating post: ${error.message}`);
      setPublishError("Something went wrong while updating the post");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h3 className="text-center text-3xl my-7 font-semibold">Update Post</h3>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <TextInput
            type="text"
            placeholder="title"
            id="title"
            required
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
            }}
            value={formData.title || ""}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category || "uncategorized"}
          >
            <option value="uncategorized">Select the Category</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="machine learning">Machine Learning</option>
            <option value="ai">AI</option>
            <option value="ds">Data Structure</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-between border-4 border-teal-500 border-dotted p-3 items-center">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleFileUpload}
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <div className="h-16 w-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}`} />
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && <img src={formData.image} className="w-full h-72 object-cover" alt="Uploaded" />}
        <ReactQuill
          theme="snow"
          id="desc"
          placeholder="Write Something..."
          className="h-72 mb-7"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
          value={formData.content || ""}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToPink"
          className="mt-4 rounded-none tracking-widest"
        >
          Update
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
};

export default UpdatePost;
