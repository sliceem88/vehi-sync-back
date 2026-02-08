import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { jobValidator } from '#validators/job'
import Job from '#models/job'
import { DateTime } from 'luxon'
import Task from '#models/task'
import { randomUUID } from 'node:crypto'

@inject()
export default class JobController {
  public async createJob({ request, response, auth }: HttpContext) {
    const service = auth.user!
    const data = await request.validateUsing(jobValidator)

    const job = await Job.create({
      vehicleId: data.vehicleId,
      serviceId: service.id,
      ownerId: data.ownerId,
      jobDate: DateTime.fromISO(data.jobDate.toString()),
      status: data.status ?? 'new',
    })

    await Task.createMany(data.tasks.map((task) =>  {
      return {
        id: randomUUID(),
        jobId: job.id,
        mechanicId: task.mechanicId,
        description: task.description,
        status: task.status,
      }
    }));

    const jobWithTasks = await Job.query().where('id', job.id).preload('tasks').firstOrFail();

    return response.json({
      data: jobWithTasks,
    })
  }

  public async getJobs({ request, response, auth }: HttpContext) {
    const service = auth.user!
    // service | owner
    const userType = request.param('userType');

    const jobs = await Job.query().where(`${userType}Id`, service.id).preload('tasks').preload('vehicle');

    return response.json({
      data: jobs,
    })
  }

}
