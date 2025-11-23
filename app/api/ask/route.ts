import { NextRequest, NextResponse } from 'next/server';
import { answerQuestion } from '@/lib/rag';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const question: string = (body?.question ?? '').toString();
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: 'Missing question' }, { status: 400 });
    }
    const { answer, citations } = answerQuestion(question);
    return NextResponse.json({ answer, citations });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to process request' }, { status: 500 });
  }
}
