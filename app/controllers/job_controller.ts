import { randomUUID } from "node:crypto";

import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

import { JobPriority, JobStatus } from "#enums/job_status";
import { ServiceRequestStatus } from "#enums/service_request";
import Job from "#models/job";
import ServiceRequest from "#models/service_request";
import Task from "#models/task";
import User from "#models/user";
import Vehicle from "#models/vehicle";
import { jobValidator } from "#validators/job";

@inject()
export default class JobController {
  public async createOwnerWithServiceAssigned({
    request,
    response,
    auth,
  }: HttpContext) {
    const service = auth.user!;
    const data = request.only(["email"]);

    const owner = await User.create({
      email: data.email,
      password: randomUUID(),
      createdByService: true,
    });

    await ServiceRequest.create({
      vehicleId: null,
      serviceId: service.id,
      status: ServiceRequestStatus.APPROVED,
      viewedByOwner: false,
      serviceComment: `Create by service: ${service.companyName}`,
      ownerId: owner.id,
    });

    return response.json({
      data: owner,
    });
  }

  public async assignVehicleToOwnerByService({
    request,
    response,
  }: HttpContext) {
    const data = request.only([
      "name",
      "type",
      "year",
      "description",
      "images",
      "additionalInfo",
      "serviceRequestId",
    ]);

    // At this point we should already have serviceRequest created
    const serviceRequest = await ServiceRequest.query()
      .where("id", data.serviceRequestId)
      .first();

    const vehicle = await Vehicle.create({
      name: data.name,
      type: data.type,
      year: data.year,
      description: data.description,
      images: {},
      additionalInfo: data.additionalInfo,
      userId: serviceRequest!.ownerId,
    });

    serviceRequest!.vehicleId = vehicle.id;

    const updatedServiceRequest = await serviceRequest?.save();

    return response.json({
      data: updatedServiceRequest,
    });
  }

  public async createJob({ request, response, auth }: HttpContext) {
    const service = auth.user!;
    const data = await request.validateUsing(jobValidator);

    const job = await Job.create({
      vehicleId: data.vehicleId,
      serviceId: service.id,
      ownerId: data.ownerId,
      jobDate: DateTime.fromISO(data.jobDate.toString()),
      status: data.status ?? JobStatus.NEW,
    });

    await Task.createMany(
      data.tasks.map((task) => {
        return {
          id: randomUUID(),
          jobId: job.id,
          mechanicId: task.mechanicId,
          description: task.description,
          status: task.status,
          priority: task.priority ?? JobPriority.LOW,
        };
      }),
    );

    const jobWithTasks = await Job.query()
      .where("id", job.id)
      .preload("tasks")
      .firstOrFail();

    return response.json({
      data: jobWithTasks,
    });
  }

  public async getJobs({ request, response, auth }: HttpContext) {
    const service = auth.user!;
    // service | owner
    const userType = request.param("userType"); // TODO: add validation

    const jobs = await Job.query()
      .where(`${userType}Id`, service.id)
      .preload("tasks")
      .preload("vehicle");

    return response.json({
      data: jobs,
    });
  }

  public async getJobById({ request, response }: HttpContext) {
    const jobId = request.param("id");
    const job = await Job.query()
      .where("id", jobId)
      .preload("tasks", (tasksQuery) => {
        tasksQuery.preload("mechanic", (subTasksQuery) => {
          subTasksQuery.select(["name", "surname"]);
        });
      })
      .preload("owner", (tasksQuery) => {
        tasksQuery.select(["name", "surname"]);
      })
      .preload("vehicle", (tasksQuery) => {
        tasksQuery.select([
          "type",
          "description",
          "name",
          "additionalInfo",
          "year",
        ]);
      })
      .firstOrFail();

    return response.json({
      data: job,
    });
  }
}
