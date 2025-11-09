import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { BucketController } from '#controllers/bucket_controller'
import ConstantController from '#controllers/constant_controller'

router.group(() => {
  // Bucket
  router.get('/bucket/list', [BucketController, 'index'])

  router.get('/bucket/list/all', [BucketController, 'all'])

  //
  router.get('/constant/all', [ConstantController, 'index'])
})
  // .middleware(middleware.auth())
