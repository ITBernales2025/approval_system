import jwt from "jsonwebtoken"
import User from "../model/User.js"
import "dotenv/config.js"

export const auth = async(req, res, next) => {
  const token = req.cookies.jwt
  try {
    jwt.verify(token, process.env.SECRET, async(err, decoded) => {
      if(err) {
        return res.status(500).json({message: "Authorization not found"})
      }
      req.user = await User.findById(decoded.userId).select("_id");
      next()
    } )
  } catch(error) {
    return res.status(500).json({ message: "No token found" })
  }
}

export const isLogin = async(req, res, next) => {
  const loggedIn = req.cookies.isLogin
  if(loggedIn) {
    next()
  } else {
    return res.status(500).json({message: "No Expiry"})
  }
}