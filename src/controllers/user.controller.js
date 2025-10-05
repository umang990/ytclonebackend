import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (err) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}



const registerUser = asyncHandler(async (req, res) => {
    //console.log(req.body)
    //get user details from frontend
    //validation(check if fields are empty)
    //check if user already exits: username , email
    //check for images , check for avatar
    //upload them to cloudinary,avatar
    //create user object- create entry in DB
    //remove password and refresh token field from response
    //check for user creation
    //return res



    const { username, email, fullName, password } = req.body
    //    console.log("email:  password: ",email,password)



    if ([username, email, fullName, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "ALL fields are required")
    }



    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "user with email or username already exists")
    }



    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }



    const avatarRef = await uploadOnCloudinary(avatarLocalPath)
    let coverImageRef = null;
    if (coverImageLocalPath) {
        coverImageRef = await uploadOnCloudinary(coverImageLocalPath);
    }


    if (!avatarRef) {
        throw new ApiError(400, "avatar is required")
    }




    const userRef = await User.create({
        username: username.toLowerCase(),
        email: email,
        fullName: fullName,
        avatar: avatarRef.url,
        coverImage: coverImageRef?.url || "",
        password: password

    })

    const createdUser = await User.findById(userRef._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully",)
    )

})


//login user
const loginUser = asyncHandler(async (req, res) => {

    //get user details from req.body
    //check if identifier is provided.  And check if password is provided or not? if no throw err
    //check if user exists in DB and find the user
    //check password is correct or not
    //generate access token and refresh token
    //send cookie

    const { identifier, password } = req.body
    if (!identifier || !password) {
        throw new ApiError(400, "username/email and password are required")
    }

    const user = await User.findOne({
        $or: [{ username: identifier.toLowerCase() }, { email: identifier.toLowerCase() }]
    })
    if (!user) {
        throw new ApiError(401, "invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "wrong password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, accessToken, refreshToken

                },
                "user logged in successfully"
            )
        )


})


//logout user
const logoutUser=asyncHandler(async (req,res)=>{

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"Logged out successfully"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
    //get refresh token from cookie
    //validate the refreshtoken 
    //if valid then generate new access token and refresh token
    //store the new refresh token in db
    //send the new access token and refresh token in cookie
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id)
        if(!user || user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401,"invalid refresh token") 
        }
    
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true        
    
        }
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    accessToken, refreshToken     
                },
                "New access token generated successfully"
            )
        )   
    
    } catch (error) {
        throw new ApiError(401,error?.message || "invalid refresh token")
    }

})
export { registerUser, loginUser, logoutUser , refreshAccessToken}