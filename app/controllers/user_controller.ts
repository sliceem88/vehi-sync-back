import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import { inject } from '@adonisjs/core'

@inject()
export default class UserController {
  async register({ request }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const user = await User.create(data)

      return User.accessTokens.create(user)
    } catch (error) {
      console.log(error.message)
    }

    return null
  }

  async login({ request }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(email, password)
    const data = await User.accessTokens.create(user)

    return {
      ...data.toJSON(),
      userType: user.type,
      fastLink: user.fastLink,
      name: user.name,
      surname: user.surname,
      description: user.description,
      companyName: user.companyName,
    }
  }

  async logout({ auth }: HttpContext) {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)

    return { message: 'success' }
  }

  async me({ auth }: HttpContext) {
    await auth.check()

    return {
      user: auth.user,
    }
  }

  async updateProfile({ request, auth, response }: HttpContext) {
    const user = auth.user!
    const data = request.only(['description', 'name', 'surname', 'companyName'])

    user.merge(data);

    await user.save()

    return response.status(200).send(await user.refresh())
  }
}
