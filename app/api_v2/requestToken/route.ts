import db from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import md5 from 'md5'
import { nanoid } from 'nanoid'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const querys = Object.fromEntries(url.searchParams.entries())
  const { pass, username } = querys

  if (!pass || !username) {
    return new NextResponse('`pass` and `username` is required', {
      status: 403,
    })
  }
  if (md5(pass) !== process.env.ADMIN_PASS_MD5) {
    return new NextResponse('pass error', { status: 403 })
  }

  const user = await db.user.create({
    data: {
      username,
      token: nanoid(64),
    },
  })

  return NextResponse.json(user)
}

export const dynamic = 'force-dynamic'
