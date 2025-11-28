import {Router , Request, Response} from'express';
const router: Router = Router();
// const controller = require('../controllers/task.controller')
import * as controller from '../controllers/user.controller'; 
import * as userValidates from '../validates/user.validate';

router.post("/register", userValidates.registerPost , controller.register);


export const userRouter: Router= router;