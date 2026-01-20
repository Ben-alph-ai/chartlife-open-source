import { NextRequest, NextResponse } from 'next/server';
import { processAnalysis } from '@/lib/llm';
import { UserInput } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: UserInput = await req.json();

    // Basic Validation
    if (!body.birthYear || !body.birthMonth || !body.birthDay) {
      return NextResponse.json(
        { error: 'Missing birth date information' },
        { status: 400 }
      );
    }

    const result = await processAnalysis(body);

    return NextResponse.json({
      task_id: `task_${Date.now()}`,
      status: 'completed',
      result: result,
      error: null
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}