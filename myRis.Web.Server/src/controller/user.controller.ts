//const model = require("model/user.model");
import * as userCommon from "@common/user";
//TSC <--> WEBPACK
import { UserModel } from "../model/user.model";

export class UserController {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  // url: /get-user
  getUser(req: any, res: any) {
    let getUserQuery: userCommon.IUserGetUserQueryCondition = req.query;

    this.userModel
      .getUser(getUserQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[UserController::getUser] ${this.getUser.name} ${err.name} ${err.message}`
        );
      });
  }

  // url: /sign-in
  signIn(req: any, res: any) {
    let signInQuery: userCommon.IUserSignInQueryCondition = req.query;

    this.userModel
      .signIn(signInQuery)
      .then((rows: userCommon.IUserSignInResponse) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[UserController::signIn] ${this.signIn.name} ${err.name} ${err.message}`
        );
      });
  }

  // url: /sign-up
  signUp(req: any, res: any) {
    let signUpQuery: userCommon.IUserSignUpQueryCondition = req.query;

    this.userModel
      .signUp(signUpQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[UserController::signUp] ${this.signUp.name} ${err.name} ${err.message}`
        );
      });
  }

  // edit
  editUser(req: any, res: any) {
    let editUserQuery: userCommon.IUserEditUserQueryCondition = req.query;

    this.userModel
      .editUser(editUserQuery)
      .then((rows: any) => {
        res.json(rows);
      })
      .catch((err: any) => {
        __logger.error(
          `[UserController::editUser] ${this.editUser.name} ${err.name} ${err.message}`
        );
      });
  }
}
