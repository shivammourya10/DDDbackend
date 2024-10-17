import express from 'express';
import {loginUser, registerUser, logoutUser} from "../controller/AuthController.js";
import  verifyJwt  from '../middlewares/verifyJwtMiddleware.js';
import rateLimit from 'express-rate-limit'
const router = express.Router();
// Create a rate limiter for login requests
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later after few mins."
});
router.post('/login', loginLimiter , loginUser);
router.post('/logout',verifyJwt, logoutUser);
router.post('/register', registerUser);
export default router;