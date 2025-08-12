import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles user signout by clearing authentication cookies
 * @route POST /api/auth/signout
 */
export async function POST(req: NextRequest) {
  try {
    // Clear the authentication cookie
    cookies().delete('token');
    
    // Return success response
    return NextResponse.json(
      { success: true, message: 'Successfully signed out' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error signing out:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
