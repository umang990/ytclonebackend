import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";





const registerUser= asyncHandler(async (req,res)=>{
   //get user details from frontend
   //validation(check if fields are empty)
   //check if user already exits: username , email
   //check for images , check for avatar
   //upload them to cloudinary,avatar
   //create user object- create entry in DB
   //remove password and refresh token field from response
   //check for user creation
   //return res



    const {username, email, fullName, password}=req.body
//    console.log("email:  password: ",email,password)

    

    if([username,email,fullName,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"ALL fields are required")
    }



    const existedUser=await User.findOne({
        $or: [{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"user with email or username already exists")
    }



    const avatarLocalPath= req.files?.avatar[0]?.path
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar is required")
    }



    const avatarRef= await uploadOnCloudinary(avatarLocalPath)
    const coverImageRef= await uploadOnCloudinary(coverImageLocalPath)


    if(!avatarRef){
        throw new ApiError(400,"avatar is required")
    }




    const userRef= await User.create({
        username: username.toLowerCase(),
        email: email,
        fullName: fullName,
        avatar: avatarRef.url,
        coverImage: coverImageRef?.url || "",
        password: password
        
    })

    const createdUser= await User.findById(userRef._id).select(
        "-password -refreshToken"
    )
    
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering")
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully",)
    )

})

export {registerUser}