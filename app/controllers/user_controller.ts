import { inject } from "@adonisjs/core";
import type { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";
import { loginValidator, registerValidator } from "#validators/auth";

@inject()
export default class UserController {
  async register({ request, response }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator);
      const user = await User.create(data);

      return User.accessTokens.create(user);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator);
    const user = await User.verifyCredentials(email, password);
    const data = await User.accessTokens.create(user);

    return {
      ...data.toJSON(),
      userType: user.type,
      fastLink: user.fastLink,
      name: user.name,
      surname: user.surname,
      description: user.description,
      companyName: user.companyName,
    };
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!;
    await User.accessTokens.delete(user, user.currentAccessToken.identifier);

    return { message: "success" };
  }

  async me({ auth }: HttpContext) {
    await auth.check();

    return {
      data: auth.user,
    };
  }

  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user!;
    const data = request.only([
      "description",
      "name",
      "surname",
      "companyName",
    ]);

    user.merge(data);

    await user.save();

    return response.status(200).send(await user.refresh());
  }
}
