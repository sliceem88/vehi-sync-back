import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";

import { UserType } from "#enums/user_type";
import { ExceptionCode } from "#exceptions/exception_code";
import User from "#models/user";
import { ResponseApi } from "#utilities/api_response";

@inject()
export default class FastlinkController {
  public async getUser({ request, response, auth }: HttpContext) {
    const user = auth.user!;
    const fastlink = request.param("fastlink");

    const fastLinkUser = await User.findBy("fast_link", fastlink);

    if (!fastLinkUser) {
      return response.notFound();
    }

    const isConnectedAlready = await user
      .related("relatedTo")
      .query()
      .where("user_id", fastLinkUser.id)
      .firstOrFail();

    if (isConnectedAlready) {
      return response.conflict();
    }

    if (this.allowToConnect(user.type!, fastLinkUser.type!)) {
      return response.json(fastLinkUser);
    }

    return response.unprocessableEntity();
  }

  public async connectUsers({ request, response, auth }: HttpContext) {
    const user = auth.user!;
    const fastLinkUserId = request.param("fastLinkUserId");

    try {
      await user.related("relatedTo").attach([fastLinkUserId]);

      return response.json(user);
    } catch (error) {
      return ResponseApi.sendError(
        response,
        "Users already connected",
        ExceptionCode.FASTLINK_EXISTS,
      );
    }
  }

  // Rules to connect account
  // Maybe move to helper, to make it reusable
  public allowToConnect = (userType: UserType, fastLinkUserType: UserType) => {
    if (userType === fastLinkUserType) {
      return false;
    }

    const rules: Record<string, boolean> = {
      "mechanic::owner": false,
      "mechanic::operator": false,
      "mechanic::service": true,
      "service::owner": true,
      "service::operator": false,
      "owner::operator": true,
    };

    return Boolean(
      rules[`${userType}::${fastLinkUserType}`] ||
      rules[`${fastLinkUserType}::${userType}`],
    );
  };
}
