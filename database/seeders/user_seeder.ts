import { BaseSeeder } from '@adonisjs/lucid/seeders'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import { UserType } from '#enums/user_type'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const usersData: Partial<User>[] = [
      {
        name: 'Alice',
        surname: 'Smith',
        email: 'alice@example.com',
        password: 'password123',
        type: UserType.OPERATOR,
        companyName: 'Alice Logistics',
      },
      {
        name: 'Bob',
        surname: 'Johnson',
        email: 'bob@example.com',
        password: 'password123',
        type: UserType.OWNER,
        companyName: 'Bob Cars',
      },
      {
        name: 'Charlie',
        surname: 'Williams',
        email: 'charlie@example.com',
        password: 'password123',
        type: UserType.SERVICE,
        companyName: 'Charlie Services',
      },
      {
        name: 'Diana',
        surname: 'Brown',
        email: 'diana@example.com',
        password: 'password123',
        type: UserType.MECHANIC,
        companyName: 'Diana Mechanics',
      },
    ]

    for (const userData of usersData) {
      await User.create({
        ...userData,
        password: await hash.use('scrypt').make(userData.password!),
      })
    }

    const alice = await User.findByOrFail('email', 'alice@example.com')
    const bob = await User.findByOrFail('email', 'bob@example.com')
    const charlie = await User.findByOrFail('email', 'charlie@example.com')

    await alice.related('relatedUsers').attach([bob.id, charlie.id])
  }
}
