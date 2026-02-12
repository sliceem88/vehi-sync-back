import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import { UserType } from "#enums/user_type";

@inject()
export default class MechanicController {
  public async getMechanicService({ response, auth }: HttpContext) {
    const user = auth.user!;
    const service = await user
      .related("relatedTo")
      .query()
      .where("type", UserType.SERVICE);

    return response.json(service);
  }
}
