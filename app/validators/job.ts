import vine from "@vinejs/vine";

import { JobPriority, JobStatus } from "#enums/job_status";

export const jobValidator = vine.compile(
  vine.object({
    jobDate: vine.string(),
    ownerId: vine.string().uuid(),
    vehicleId: vine.string().uuid(),
    status: vine.enum(JobStatus),

    tasks: vine
      .array(
        vine.object({
          id: vine.string().uuid(),
          description: vine.string().trim().minLength(1),
          mechanicId: vine.string().uuid(),
          status: vine.enum(JobStatus),
          priority: vine.enum(JobPriority),
        }),
      )
      .minLength(1), // optional but usually sensible
  }),
);

export const userValidator = vine.compile(
  vine.object({
    email: vine.string().email(),

    name: vine.string().trim().minLength(1).optional(),

    surname: vine.string().trim().minLength(1).optional(),
  }),
);
