require('dotenv').config();
require('module-alias/register');

const sendVerifyEmailJob = require('@/jobs/sendVerifyEmailJob');
const sendCodeJob = require('@/jobs/sendCodeJob');
const scheduledAnnouncementEmail = require('@/jobs/scheduledAnnouncementEmail');
const queueService = require('@/services/queue.service');
const sendForgotPasswordJob = require('@/jobs/sendForgotPasswordJob');

const handlers = {
  sendVerifyEmailJob,
  sendCodeJob,
  scheduledAnnouncementEmail,
  sendForgotPasswordJob,
};

async function jobProcess(job) {
  const handler = handlers[job.type];

  if (handler) {
    try {
      await queueService.update(job.id, { status: 'processing' });
      await handler(job);
      await queueService.update(job.id, { status: 'completed' });
    } catch (error) {
      await queueService.update(job.id, { status: 'reject' });
    }
  }
}

async function queueWorker() {
  while (true) {
    const jobs = await queueService.findPendingJobs();

    for (let job of jobs) {
      await jobProcess(job);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

queueWorker();
