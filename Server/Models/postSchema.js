




import mongoose from "mongoose";


const postSchema = new mongoose.Schema({

    userId:{

        type: String,
        required: true,

    },

    content:{

        type:String,
        required:true,

    },

    title:{

        type:String,
        required:true,
        unique : true,
    },

    image :{

        type: String,

        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fvenngage.com%2Fblog%2Fblogging-tips%2F&psig=AOvVaw2ihuHLdxRSiA2HGUS4LbZf&ust=1718308309677000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNirvrLr1oYDFQAAAAAdAAAAABAI"
    },

    category : {
        type: String,
        default : "uncategorized"
    },

    slug:{
        type: String,
        required: true,
    }
},{timestamps: true})




const Post = mongoose.model("post",postSchema)

export default Post;