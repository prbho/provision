import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  return NextResponse.json(
    {
      success: false,
      error: 'Agent analytics endpoint is not implemented yet',
      agentId: id,
    },
    { status: 501 }
  )
}
