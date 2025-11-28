import {taskRouter} from "./task.route";
import { Express } from "express";
import {userRouter} from "./user.route";

const mainV1Routes = (app: Express): void => {
    const version = "/api/v1"
    app.use(version+ `/tasks`, taskRouter);
    app.use(version+ `/users`, userRouter);
}
export default mainV1Routes;