import type { Request, Response } from 'express'
import { clerkClient } from '@clerk/express'

const parseNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const listUsers = async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseNumber(req.query.limit, 20), 100)
    const offset = parseNumber(req.query.offset, 0)

    const [users, totalCount] = await Promise.all([
      clerkClient.users.getUserList({ limit, offset }),
      clerkClient.users.getCount(),
    ])

    return res.status(200).json({
      users,
      totalCount,
      limit,
      offset,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch users', error: String(error) })
  }
}

export const banUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.body?.userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    const user = await clerkClient.users.banUser(userId)

    return res.status(200).json({
      message: 'User banned successfully',
      user,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to ban user', error: String(error) })
  }
}

export const unbanUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.body?.userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    const user = await clerkClient.users.unbanUser(userId)

    return res.status(200).json({
      message: 'User unbanned successfully',
      user,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to unban user', error: String(error) })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id || req.body?.userId
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' })
    }

    await clerkClient.users.deleteUser(userId)

    return res.status(200).json({
      message: 'User deleted successfully',
      userId,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to delete user', error: String(error) })
  }
}
