export enum JobStatus {
  NEW = "new",
  IN_PROGRESS = "inProgress",
  ONHOLD = "onHold",
  COMPLETED = "completed",
}

export const JobStatusLabels = {
  [JobStatus.NEW]: "New",
  [JobStatus.IN_PROGRESS]: "In Progress",
  [JobStatus.ONHOLD]: "On Hold",
  [JobStatus.COMPLETED]: "Completed",
};

export enum JobPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export const JobPriorityLabels = {
  [JobPriority.HIGH]: "High",
  [JobPriority.MEDIUM]: "Medium",
  [JobPriority.LOW]: "Low",
};
