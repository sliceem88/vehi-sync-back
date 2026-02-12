import { BaseSeeder } from "@adonisjs/lucid/seeders";
import { faker } from "@faker-js/faker";

import { UserType } from "#enums/user_type";
import User from "#models/user";

export default class ServiceUsersSeeder extends BaseSeeder {
  public async run() {
    const serviceUsers = Array.from({ length: 10 }).map(() => ({
      name: faker.person.firstName(),
      surname: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: "password123", // or hash if User model handles hashing
      type: UserType.SERVICE,
      companyName: faker.company.name(),
    }));

    await User.createMany(serviceUsers);
  }
}
