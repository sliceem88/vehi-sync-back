import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { ServiceRequestStatusLabels } from '#enums/service_request'

@inject()
export default class ConstantController {
  async index(ctx: HttpContext) {
    const accountTypes = [
      { key: 'operator', label: 'Operator' },
      { key: 'owner', label: 'Vehicle Owner' },
      { key: 'service', label: 'Service Owner' },
      { key: 'mechanic', label: 'Mechanic' },
    ];
    const vehicleTypes = [
      { key: 'velo', label: 'Bicycle' },
      { key: 'moto', label: 'Motorcycle' },
      { key: 'light', label: 'Light Vehicle' },
      { key: 'heavy', label: 'Heavy Vehicle' },
      { key: 'tractor', label: 'Tractor' },
      { key: 'trailer', label: 'Trailer' },
    ];

    return ctx.response.json({
      accountTypes,
      vehicleTypes,
      serviceRequestStatus: ServiceRequestStatusLabels,
    })
  }
}
