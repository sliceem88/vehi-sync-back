import type { HttpContext } from '@adonisjs/core/http'

export default class ConstantController {
  async index({ auth, response }: HttpContext) {
    const accountTypes = [
      {key: 'operator', label: 'Operator'},
      {key: 'owner', label: 'Vehicle Owner'},
      {key: 'service', label: 'Service Owner'},
      {key: 'mechanic', label: 'Mechanic'},
    ];

    return response.json(accountTypes)
  }
}
