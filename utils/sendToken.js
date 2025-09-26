// export default (user,statusCode,res)=>{
//     const token = user.getJwtToken()
//     const options = {
//         expires:new Date(Date.now()+process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000),
//         httpOnly:true,
//          sameSite: "none",  // important for cross-site cookies
//   secure: process.env.NODE_ENV === "production" // secure only in prod
//     }
//     res.status(statusCode).cookie("token",token,options).json({
//         token,
//     })
// }
export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};
