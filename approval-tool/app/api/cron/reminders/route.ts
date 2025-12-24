import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendReminderEmail } from "@/lib/email";
import { env } from "@/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const pendingReviewers = await prisma.reviewer.findMany({
      where: {
        status: "PENDING",
        review: {
          status: "PENDING",
          deadline: { gte: now },
        },
        OR: [
          { lastReminderSentAt: null, createdAt: { lte: oneDayAgo } },
          { lastReminderSentAt: { lte: threeDaysAgo } },
        ],
      },
      include: {
        review: {
          include: {
            creator: { select: { name: true, email: true } },
          },
        },
      },
      take: 50,
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const reviewer of pendingReviewers) {
      try {
        const accessUrl = `${env.NEXT_PUBLIC_APP_URL}/review/${reviewer.review.slug}?token=${reviewer.accessToken}`;

        await sendReminderEmail({
          to: reviewer.email,
          reviewerName: reviewer.name ?? undefined,
          creatorName:
            reviewer.review.creator.name ??
            reviewer.review.creator.email ??
            "Someone",
          title: reviewer.review.title,
          reviewUrl: accessUrl,
        });

        await prisma.reviewer.update({
          where: { id: reviewer.id },
          data: { lastReminderSentAt: now },
        });

        await prisma.activityLog.create({
          data: {
            action: "REMINDER_SENT",
            reviewId: reviewer.review.id,
            metadata: { email: reviewer.email, automated: true },
          },
        });

        sentCount++;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        errors.push(`Failed to send to ${reviewer.email}: ${message}`);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalPending: pendingReviewers.length,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[Cron] Auto-reminder error:", error);
    return NextResponse.json(
      {
        error: "Failed to process reminders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
