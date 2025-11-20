import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { BucketController } from '#controllers/bucket_controller'
import ConstantController from '#controllers/constant_controller'
import UserController from '#controllers/user_controller'
import VehiclesController from '#controllers/vehicles_controller'



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
    // Constants
    router.get('/constant/all', [ConstantController, 'index'])

    router.post('/vehicle', [VehiclesController, 'create'])
    router.get('/vehicle/all', [VehiclesController, 'getAll'])
    router.get('/vehicle/:id', [VehiclesController, 'show'])
  })
    .middleware(middleware.auth())

}).prefix('/api')
