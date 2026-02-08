import vine from '@vinejs/vine'
import { JobStatusType } from '#enums/job_status'

export const jobValidator = vine.compile(
  vine.object({
    jobDate: vine.string(),
    ownerId: vine.string().uuid(),
    vehicleId: vine.string().uuid(),
    status: vine.enum(JobStatusType),

    tasks: vine
      .array(
        vine.object({
          id: vine.string().uuid(),
          description: vine.string().trim().minLength(1),
          mechanicId: vine.string().uuid(),
          status: vine.enum(JobStatusType),
        })
      )
      .minLength(1), // optional but usually sensible
  })
)
