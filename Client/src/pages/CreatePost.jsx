import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



const CreatePost = () => {
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
          <FileInput type="file" accept="image/*" />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
          >
            {" "}
            Upload Image
          </Button>
        </div>

        <ReactQuill theme="snow" placeholder = "Write Something..." className="h-72 mb-7" required/>
        <Button type="submit" gradientDuoTone="purpleToPink" className="mt-4 rounded-none tracking-widest ">Publish</Button>
      </form> 
    </div>
  );
};

export default CreatePost;
