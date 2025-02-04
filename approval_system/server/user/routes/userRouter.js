import { Router } from "express";
import { 
  allUser, 
  changePass, 
  checkAuth, 
  findAomAccount, 
  findUser, 
  itUpdateIsOnline, 
  login, 
  logout, 
  logoutUsingUserId, 
  register, 
  updateAccount, 
  updateIsOnline 
} from "../controllers/userControllers.js";
import { auth, isLogin } from "../../../middleware/auth.js";
import { validateChangePassword, validateLogin, validateUpdateUser, validateUser } from "../../../middleware/modelValidation.js";

const router = Router();

router.post(`/create`, validateUser, register)
router.post('/login', validateLogin, login)
router.post('/logout',auth, logout)
router.put("/update-account/:id", validateUpdateUser, updateAccount)
router.put('/update-isonline/:id', updateIsOnline)
router.get('/find-user/:id', findUser)
router.get('/find-alluser', allUser)
router.put("/change-password/:id", validateChangePassword, changePass)
router.put('/update-it-is-online',itUpdateIsOnline)
router.get('/checking-auth', auth, isLogin, checkAuth)
router.post("/logout/:userId", logoutUsingUserId)
router.get('/get-aoms', findAomAccount)
export {router as UserRouter};