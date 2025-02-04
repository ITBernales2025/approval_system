import asyncHandler from "../../../middleware/asyncHandler.js";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import bcrypt from "bcryptjs";
import User from "../../../model/User.js";


// token generator==========================================================
const createToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV != "development",
    sameSite: "strict",
  });
  return token
};

// user register=============================================================
export const register = asyncHandler(async( req, res, next ) =>  {
  const {name, username, password, type, department, branch, email} = req.body
  
  const existingUser = await User.findOne({username})

  if(existingUser) {
    return res.status(400).json({message: "Username is already exists!"})
  } 

  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    await User.create({
      name, username, password: hashPassword,type, department, branch, email
    })
    return res.status(200).json({message: "New Account added"})
  } catch(err) {
    next(err)
  }
  
})

//user login======================================================================
export const login = asyncHandler(async(req, res, next) => {
  const {username, password} = req.body
  const user = await User.findOne({username})
  if(user) {
    const match = await bcrypt.compare(password, user.password);
    if(match)  {
      if(!user.isOnline) {
        createToken(res, user._id)
        res.cookie("isLogin", "this is for login only", {
          httpOnly: false,
          secure: process.env.NODE_ENV != "development",
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000,
        });
        try {
          await user.updateOne({isOnline: true})
          return res.status(200).json({...user._doc, password: "", isOnline: true})
        } catch (error) {
          console.log(error)
          next(error)
        }
      } else {
        return res.status(401).json({message: "Account is already logged in"})
      }
    } else {
      return res.status(400).json({message: "Incorrect username or password"})
    }
  } else {
    return res.status(400).json({message: "Incorrect username or password"})
  }
})

//user logout =====================================================================
export const logout = asyncHandler(async(req, res, next) => {
  try {
    const loggedOut = await User.findByIdAndUpdate(req.user, {isOnline: false})
    if(!loggedOut) return res.status(404).json({message: "User not found"})
      res.cookie("jwt", "" , {
        httpOnly: true
      })
      res.cookie("isLogin", "" , {
        httpOnly: false
      })
    return res.status(200).json({message: "successfully logout"})
  } catch (error) {
    next(error)
  }
})

//user update account =============================================================
export const updateAccount = asyncHandler(async(req, res, next) => {
  const {id} = req.params
  const {name, email} = req.body
  try {
    const updateUser = await User.findByIdAndUpdate(id, {name: name, email: email})
    if(!updateUser) return res.status(404).json({message: "User not found"})
    return res.status(200).json({message: "User account updated"})
  } catch (error) {
    next(error)
  }
})

//user update isOnline ===========================================================
export const updateIsOnline = asyncHandler(async(req, res, next) => {
  const {id} = req.params
  try {
    const updateUser = await User.findByIdAndUpdate(id, {isOnline: false})
    if(!updateUser) return res.status(404).json({message: "User not found"})
    return res.status(200).json({message: "User account updated"})
  } catch (error) {
    next(error)
  }
})

//all users query =================================================================
export const allUser = asyncHandler(async(req, res, next) => {
  try {
    const users = await User.find({type: {$ne: "ADMIN"}}).select('-password')
    return res.status(200).json(users)
  } catch (error) {
    next(error)

  }
})

//find user ======================================================================
export const findUser = asyncHandler(async(req, res, next) => {
  const {id} = req.params
  try {
    const findUser = await User.findById(id).select('-password')
    if(!findUser) return res.status(404).json({message: "User not found"})
    return res.status(200).json(findUser) 
  } catch (error) {
    next(error)
  }
})

//user change password ==========================================================
export const changePass = asyncHandler(async(req, res, next) => {
  const {id} = req.params
  const {password} = req.body
  const user = await User.findById(id)
  if(!user) return res.status(404).json({message: "User not found"})
  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(password, salt)
  try {
    await User.updateOne({password: hashPassword})
    return res.status(200).json({message: "User successfully change password"})
  } catch (error) {
    next(error)
  }
})

export const itUpdateIsOnline = asyncHandler(async(req, res, next) => {
  const {username} = req.query

  const user = await User.findOne({username})
  if(!user)return res.status(404).json({message: "User not found"})
  if(user.type === "ADMIN") { 
    try {
      user.isOnline = false
      await user.save()
      return res.status(200).json({message: "Successfully offline"})
    } catch (error) {
      next(error)
    }
  } else {
    return res.status(401).json({message: "Unauthorize"})
  }
})

export const checkAuth = asyncHandler(async(req, res) => {
  if(req.user) {
    return res.status(200).json({message: "Check authorization if exsist"})
  } else {
    return res.status(500).json({message: "Missing Authorization"})
  }
})

export const logoutUsingUserId = asyncHandler(async(req,res,next) => {
  const {userId} = req.params
  const user = await User.findById(userId)
  if(!user) return res.status(404).json({message: "User not found"})
  try {
    user.isOnline = false
    res.cookie("jwt", "" , {
      httpOnly: true
    })
    res.cookie("isLogin", "" , {
      httpOnly: false
    })
    await user.save()
    return res.status(200).json({message: "User successfully logout"})
  } catch (error) {
    next(error)
  }
})

export const findAomAccount = asyncHandler(async(req, res, next) => {
  try {
    const aom = await User.find({type: "AOM"})
    return res.status(200).json(aom)
  } catch (error) {
    next(error)
  }
})