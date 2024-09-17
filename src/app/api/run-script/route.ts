import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execPromise = promisify(exec);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const script = searchParams.get('script');

  if (!script) {
    return NextResponse.json({ error: 'No script specified' }, { status: 400 });
  }

  const scriptPath = path.join(process.cwd(), script);

  try {
    console.log(`Attempting to execute: python ${scriptPath}`);
    const { stdout, stderr } = await execPromise(`python ${scriptPath}`, {
      env: {
        ...process.env,
        SURREALDB_USER: process.env.SURREALDB_USER || 'root',
        SURREALDB_PASS: process.env.SURREALDB_PASS || 'root',
      }
    });

    if (stderr) {
      console.error(`Error executing script: ${stderr}`);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    console.log(`Script output: ${stdout}`);
    return NextResponse.json({ result: stdout });
  } catch (error: unknown) {
    console.error(`Failed to execute script:`, error);

    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json({
      error: 'Failed to execute script',
      details: errorMessage
    }, { status: 500 });
  }
}