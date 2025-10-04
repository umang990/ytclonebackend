//promise wala tareeka
const asyncHandler=(reqhandler)=>(
    (req,res,next)=>{
        Promise
        .resolve(reqhandler(req,res,next))
        .catch((err)=>next(err))
    }
)

//async wala tareeka
// const asyncHandler = (fn)=>async (req,res,next)=>{
//     try{
//         await fn(req,res,next)
//     }
//     catch{
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })

//     }
// }

export {asyncHandler}  