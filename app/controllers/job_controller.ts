import { randomUUID } from "node:crypto";

import { inject } from "@adonisjs/core";
import { HttpContext } from "@adonisjs/core/http";
import { DateTime } from "luxon";

import { JobPriority, JobStatus } from "#enums/job_status";
import UserTypeNotFoundException from "#exceptions/user_type_not_found";
import Job from "#models/job";
import ServiceRequest from "#models/service_request";
import Task from "#models/task";
import Vehicle from "#models/vehicle";
import { JobService } from "#services/job_service";
import { jobValidator, userValidator } from "#validators/job";

@inject()
export default class JobController {
  constructor(protected jobService: JobService) {}

  public async createOwnerWithServiceAssigned({
    request,
    response,
    auth,
  }: HttpContext) {
    const service = auth.user!;
    const data = await request.validateUsing(userValidator);
    const owner = await this.jobService.assignOwnerAndServiceRequest(
      data,
      service,
    );

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

    if (!userType) {
      throw new UserTypeNotFoundException();
    }

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
