import { randomUUID } from "node:crypto";

import { ServiceRequestStatus } from "#enums/service_request";
import ServiceRequest from "#models/service_request";
import User from "#models/user";

export class JobService {
  /**
   * Validate owner check, if already exist/or create new.
   * Assign owner to ServiceRequest
   */
  public async assignOwnerAndServiceRequest(
    data: {
      email: string;
      name?: string;
      surname?: string;
    },
    service: User,
  ) {
    const owner = await this.getOwner(data.email, data.name, data.surname);

    const serviceRequestExists = await ServiceRequest.query()
      .where("ownerId", owner.id)
      .whereNull("vehicleId")
      .first();

    if (!serviceRequestExists) {
      await ServiceRequest.create({
        vehicleId: null,
        serviceId: service.id,
        status: ServiceRequestStatus.APPROVED,
        viewedByOwner: false,
        serviceComment: `Create by service: ${service.companyName}`,
        ownerId: owner.id,
      });
    }

    return owner;
  }

  private async getOwner(
    email: string,
    name?: string,
    surname?: string,
  ): Promise<User> {
    const owner = await User.query().where("email", email).first();

    if (owner) {
      return owner;
    }

    return await User.create({
      name: name,
      surname: surname,
      email: email,
      password: randomUUID(),
      createdByService: true,
    });
  }
}
