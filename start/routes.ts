import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { BucketController } from '#controllers/bucket_controller'
import ConstantController from '#controllers/constant_controller'
import UserController from '#controllers/user_controller'
import VehiclesController from '#controllers/vehicles_controller'
import ServicesController from '#controllers/services_controller'
import OwnersController from '#controllers/owner_controller.'
import MechanicController from '#controllers/mechanic_controller'
import FastlinkController from '#controllers/fastlink_controller'



router.group(() => {
  router.group(() => {
    // User
    router.post('/register', [UserController, 'register']).as('register')
    router.post('/login', [UserController, 'login']).as('login')
    router.delete('/logout', [UserController, 'logout']).as('logout').middleware(middleware.auth())
    router.get('/me', [UserController, 'me']).as('me').middleware(middleware.auth())
  }).prefix('/user')

  router.group(() => {
    // Bucket
    router.get('/bucket/list', [BucketController, 'index'])
    router.get('/bucket/list/all', [BucketController, 'all'])

    //Services
    router.get('/service/all', [ServicesController, 'show'])
    router.post('/service/owner/:serviceId', [ServicesController, 'assignVehicleOwner'])
    router.get('/service/owner', [ServicesController, 'getAssignedServices'])
    router.delete('/service/owner/:serviceId', [ServicesController, 'deleteAssignedService'])
    router.post('/service/mechanic/', [ServicesController, 'addMechanicToService'])
    router.get('/service/mechanic/', [ServicesController, 'getMechanics'])

    //Owners
    router.get('/owner/service', [OwnersController, 'show'])

    //Mechanic
    router.get('/mechanic/service', [MechanicController, 'getMechanicService'])

    //Fastlink
    router.get('/fastlink/:fastlink', [FastlinkController, 'getUser'])
    router.post('/fastlink/connect/:fastLinkUserId', [FastlinkController, 'connectUsers'])

    // Vehicle
    router.post('/vehicle', [VehiclesController, 'create'])
    router.get('/vehicle/all', [VehiclesController, 'getAll'])
    router.get('/vehicle/:id', [VehiclesController, 'show'])
    router.delete('/vehicle/:id', [VehiclesController, 'delete'])
  })
    .middleware(middleware.auth())

  // Constants
  router.get('/constant/all', [ConstantController, 'index'])

}).prefix('/api')
