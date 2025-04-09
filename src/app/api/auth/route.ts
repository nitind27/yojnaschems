import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
    }

    const supervisor = await prisma.tblusers.findFirst({
      where: { username },
    });

    if (!supervisor) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Directly compare the provided password with the stored password
    if (supervisor.password !== password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Ensure supervisor has an id property
    if (!supervisor.user_id) {
      return NextResponse.json({ message: 'Supervisor ID not found' }, { status: 500 });
    }

    // Ensure JWT_SECRET is defined
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = sign({ id: supervisor.user_id }, JWT_SECRET, { expiresIn: '1h' });
    
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('token', token, { httpOnly: true });

    return response;
    
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ message: 'An error occurred during authentication' }, { status: 500 });
  }
}
