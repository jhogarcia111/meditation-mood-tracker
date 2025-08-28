import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const ActivityActions = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  REGISTER: 'REGISTER',
  CREATE_RECORD: 'CREATE_RECORD',
  UPDATE_RECORD: 'UPDATE_RECORD',
  DELETE_RECORD: 'DELETE_RECORD',
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  VIEW_ADMIN: 'VIEW_ADMIN',
  CREATE_FEELING: 'CREATE_FEELING',
  UPDATE_FEELING: 'UPDATE_FEELING',
  DELETE_FEELING: 'DELETE_FEELING',
  CREATE_MEDITATION: 'CREATE_MEDITATION',
  UPDATE_MEDITATION: 'UPDATE_MEDITATION',
  DELETE_MEDITATION: 'DELETE_MEDITATION',
  CREATE_MEDITATION_TAG: 'CREATE_MEDITATION_TAG',
  UPDATE_MEDITATION_TAG: 'UPDATE_MEDITATION_TAG',
  DELETE_MEDITATION_TAG: 'DELETE_MEDITATION_TAG',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  CREATE_USER: 'CREATE_USER',
} as const

export async function logActivity(
  userId: string,
  action: keyof typeof ActivityActions,
  details: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.activityLog.create({
      data: {
        userId,
        action,
        details,
        ipAddress: ipAddress || 'unknown',
        userAgent: userAgent || 'unknown',
      },
    })
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}
