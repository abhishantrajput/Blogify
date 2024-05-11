import jwt from "jsonwebtoken"




export const setUser = (user)=>{

    return jwt.sign({
      id: user._id,
      email:user.email,
      username: user.username,
    },process.env.JWT_Secret,{
        expiresIn:"15d"
    })
}


// export const getUser = (token)=>{
//     return jwt.verify(token, process.env.JWT_Secret,(err,user)=>{

//         if(err){

//             return err;
//         }

//         return  user;
//     })
// }