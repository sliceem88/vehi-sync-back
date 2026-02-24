import router from "@adonisjs/core/services/router";

const BucketController = () => import("#controllers/bucket_controller");
const ConstantController = () => import("#controllers/constant_controller");
const FastlinkController = () => import("#controllers/fastlink_controller");
const JobController = () => import("#controllers/job_controller");
const MechanicController = () => import("#controllers/mechanic_controller");
const OwnersController = () => import("#controllers/owner_controller.");
const ServicesRequestController = () =>
  import("#controllers/service_request_controller");
const ServicesController = () => import("#controllers/services_controller");
const UserController = () => import("#controllers/user_controller");
const VehiclesController = () => import("#controllers/vehicles_controller");
import { middleware } from "#start/kernel";

router
  .group(() => {
    router
      .group(() => {
        // User
        router.post("/register", [UserController, "register"]).as("register");
        router.post("/login", [UserController, "login"]).as("login");
        router
          .delete("/logout", [UserController, "logout"])
          .as("logout")
          .middleware(middleware.auth());
        router
          .get("/me", [UserController, "me"])
          .as("me")
          .middleware(middleware.auth());
      })
      .prefix("/user");

    router
      .group(() => {
        // Bucket
        router.get("/bucket/list", [BucketController, "index"]);
        router.get("/bucket/list/all", [BucketController, "all"]);

        //User
        router.put("/user", [UserController, "updateProfile"]);

        //Services
        router.get("/service/all", [ServicesController, "show"]);
        // router.post('/service/owner/:serviceId', [ServicesController, 'assignVehicleOwner'])
        router.get("/service/owner", [
          ServicesController,
          "getAssignedOrRequestedOwnerWithVehicle",
        ]);
        router.post("/service/owner/:serviceRequestId", [
          ServicesController,
          "serviceRequestRespond",
        ]);

        router.delete("/service/owner/:serviceId", [
          ServicesController,
          "deleteAssignedService",
        ]);
        router.post("/service/mechanic/", [
          ServicesController,
          "addMechanicToService",
        ]);
        router.get("/service/mechanic/", [ServicesController, "getMechanics"]);
        router.get("/service/vehicle/", [
          ServicesController,
          "getVehicleForJobs",
        ]);

        //Service request assign
        router.post("/service/job/:serviceId", [
          ServicesRequestController,
          "makeAssignRequest",
        ]);

        //Owners
        router.get("/owner/service", [
          OwnersController,
          "getAssignedOrRequestedServiceWithVehicle",
        ]);

        //Mechanic
        router.get("/mechanic/service", [
          MechanicController,
          "getMechanicService",
        ]);

        //Fastlink
        router.get("/fastlink/:fastlink", [FastlinkController, "getUser"]);
        router.post("/fastlink/connect/:fastLinkUserId", [
          FastlinkController,
          "connectUsers",
        ]);

        //Job
        router.post("/job", [JobController, "createJob"]);
        router.get("/job/:id", [JobController, "getJobById"]);
        router.post("/job/owner", [
          JobController,
          "createOwnerWithServiceAssigned",
        ]);
        router.post("/job/vehicle", [
          JobController,
          "assignVehicleToOwnerByService",
        ]);
        router.get("/jobs/:userType", [JobController, "getJobs"]);

        // Vehicle
        router.post("/vehicle", [VehiclesController, "create"]);
        router.get("/vehicle/all", [VehiclesController, "getAll"]);
        router.get("/vehicle/owner/:id", [VehiclesController, "getByOwnerId"]);
        router.get("/vehicle/:id", [VehiclesController, "show"]);
        router.delete("/vehicle/:id", [VehiclesController, "delete"]);
        router.put("/vehicle/:id", [VehiclesController, "update"]);
      })
      .middleware(middleware.auth());

    // Constants
    router.get("/constant/all", [ConstantController, "index"]);
  })
  .prefix("/api");
