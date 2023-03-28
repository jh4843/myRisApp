//TSC <--> WEBPACK
import { ClientRouter } from "../route/client.route";
import { SystemRouter } from "../route/sys.route";
import { MwlRouter } from "../route/mwl.route";
import { UserRouter } from "../route/user.route";

export class Routes {
  private clientRouter: ClientRouter;
  private systemRouter: SystemRouter;
  private mwlRouter: MwlRouter;
  private userRouter: UserRouter;

  constructor() {
    this.clientRouter = new ClientRouter();
    this.systemRouter = new SystemRouter();
    this.mwlRouter = new MwlRouter();
    this.userRouter = new UserRouter();
  }
  routes(app: any): void {
    // app.route("/api").get((req: Request, res: Response) => {
    //   res.status(200).send({
    //     message: "GET request successful",
    //   });
    // });

    // CLIENT ROUTER
    this.clientRouter.routes(app);

    // SYSTEM ROUTER
    this.systemRouter.routes(app);

    // MWL ROUTER
    this.mwlRouter.routes(app);

    // USER ROUTER
    this.userRouter.routes(app);
  }
}
