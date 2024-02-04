import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    date: new Date().toLocaleString('zh-cn', { timeZone: 'Asia/Chongqing' }),
  })
}

export const dynamic = 'force-dynamic'
