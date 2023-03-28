import { Request, Response } from "express";
//TSC <--> WEBPACK
import { UserController } from "../controller/user.controller";

export class UserRouter {
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  routes(app: any): void {
    // Get User Info
    app.route("/api/user/get-user").get((req: Request, res: Response) => {
      this.userController.getUser(req, res);
    });

    // Sign-In
    app.route("/api/user/sign-in").get((req: Request, res: Response) => {
      this.userController.signIn(req, res);
    });

    // Sign-Up
    app.route("/api/user/sign-up").get((req: Request, res: Response) => {
      this.userController.signUp(req, res);
    });

    // Edit User
    app.route("/api/user/edit-user").get((req: Request, res: Response) => {
      this.userController.editUser(req, res);
    });
  }
}
