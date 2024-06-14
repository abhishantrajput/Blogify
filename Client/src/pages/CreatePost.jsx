import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import {app} from "../../firebase.js"


import {CircularProgressbar} from "react-circular-progressbar"

import "react-circular-progressbar/dist/styles.css"



const CreatePost = () => {


  const [file, setFile] = useState(null);

  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError , setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({})


  const handleFileUpload = async()=>{


     try {

      if(!file){


        setImageUploadError("Please Select an Image");

        return;
      }


      setImageUploadError(null);


      const storage = getStorage(app);

      const fileName = new Date().getTime() + "-" + file.name;

      const storageRef = ref(storage, fileName);


      const uploadTask = uploadBytesResumable(storageRef, file);


      uploadTask.on("state_changed", (snapshot)=>{

        const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;

        setImageUploadProgress(progress.toFixed(0));
      }, (error)=>{


        setImageUploadError("Something went Wrong");
        setImageUploadProgress(null);
      },
    
    
    
    ()=>{


      getDownloadURL(uploadTask.snapshot.ref).then((downloadURl)=>{


        setImageUploadError(null)
        setImageUploadProgress(null)

        setFormData({...formData, image: downloadURl})
      })

      


    })

      
     } catch (error) {

      setImageUploadError("Image Failed to Upload")
      setImageUploadProgress(null)
      console.log(error)
      
      
     }



  }


  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h3 className="text-center text-3xl my-7 font-semibold">Create Post</h3>

      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <TextInput
            type="text"
            placeholder="title"
            id="title"
            required
            className="flex-1"
          />

          <Select>
            <option value="uncategorized"> Select the Category</option>
            <option value="javascript">Javascript</option>
            <option value="python">Python</option>
            <option value="machinelearning">Machine Learing</option>
            <option value="ai">AI</option>
            <option value="ds">Data Structure</option>
          </Select>
        </div>

        <div className="flex gap-4 justify-between border-4 border-teal-500 border-dotted p-3 items-center">
          <FileInput type="file" accept="image/*" onChange={(e)=>setFile(e.target.files[0])} />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleFileUpload}
            disabled={imageUploadProgress}
          >
            {" "}
           {imageUploadProgress && (

            <div className="h-16 w-16">
              <CircularProgressbar value={imageUploadProgress } text={`${imageUploadProgress || 0}`} />
            </div>
           )}

           Upload 
          </Button>
        </div>

        {imageUploadError && (

          <Alert color={"failure"}>


            {imageUploadError}
            
          </Alert>
        )}



        {formData.image && (


        <img

        src={formData.image}
        className="w-full h-72 object-cover"
        
        />



        )}

        <ReactQuill theme="snow" id="desc" placeholder = "Write Something..." className="h-72 mb-7" required/>
        <Button type="submit" gradientDuoTone="purpleToPink" className="mt-4 rounded-none tracking-widest ">Publish</Button>
      </form> 
    </div>
  );
};

export default CreatePost;
