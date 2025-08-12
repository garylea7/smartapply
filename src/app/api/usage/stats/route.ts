import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('accessToken')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const userId = payload.userId;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get usage statistics
    const [todayUsage, monthlyUsage, lastAnalysis] = await Promise.all([
      // Today's usage
      db.usageLog.count({
        where: {
          userId,
          action: 'analyze',
          createdAt: {
            gte: today,
          },
        },
      }),
      
      // Monthly usage
      db.usageLog.count({
        where: {
          userId,
          action: 'analyze',
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      
      // Last analysis
      db.analysis.findFirst({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          atsScore: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      todayUsage,
      monthlyUsage,
      lastAnalysis,
    });
  } catch (error) {
    console.error('Get usage stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}