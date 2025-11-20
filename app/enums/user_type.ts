export enum UserType {
  OPERATOR = 'operator',
  OWNER = 'owner',
  SERVICE = 'service',
  MECHANIC = 'mechanic',
}

export const UserTypeLabels: Record<UserType, string> = {
  [UserType.OPERATOR]: 'Operator',
  [UserType.OWNER]: 'Vehicle Owner',
  [UserType.SERVICE]: 'Service Owner',
  [UserType.MECHANIC]: 'Mechanic',
}
