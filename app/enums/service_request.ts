export enum ServiceRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export const ServiceRequestStatusLabels: Record<number, ServiceRequestStatus> = [
  ServiceRequestStatus.PENDING,
  ServiceRequestStatus.APPROVED,
  ServiceRequestStatus.DECLINED,
]
