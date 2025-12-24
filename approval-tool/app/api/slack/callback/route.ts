import { env } from "@/env";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const state = url.searchParams.get("state");

    if (error) {
      console.error("Slack OAuth error:", error);
      redirect(`/dashboard/settings?slack_error=${encodeURIComponent(error)}`);
    }

    if (!code) {
      return Response.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    if (!env.SLACK_CLIENT_ID || !env.SLACK_CLIENT_SECRET) {
      console.error("Slack OAuth credentials not configured");
      return Response.json(
        { error: "Slack integration not configured" },
        { status: 500 }
      );
    }

    const formData = new URLSearchParams({
      client_id: env.SLACK_CLIENT_ID,
      client_secret: env.SLACK_CLIENT_SECRET,
      code,
      redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/slack/callback`,
    });

    const tokenResponse = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.ok) {
      console.error("Slack OAuth token exchange failed:", tokenData.error);
      redirect(`/dashboard/settings?slack_error=${encodeURIComponent(tokenData.error)}`);
    }

    const organizationId = state;

    if (!organizationId) {
      return Response.json(
        { error: "No organization ID in state parameter" },
        { status: 400 }
      );
    }

    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: session.user.id,
        organizationId,
        role: {
          in: ["OWNER", "ADMIN"],
        },
      },
    });

    if (!membership) {
      return Response.json(
        { error: "Not authorized to configure Slack for this organization" },
        { status: 403 }
      );
    }

    await prisma.slackIntegration.upsert({
      where: { organizationId },
      create: {
        organizationId,
        accessToken: tokenData.access_token,
        botUserId: tokenData.bot_user_id,
        teamId: tokenData.team.id,
        teamName: tokenData.team.name,
      },
      update: {
        accessToken: tokenData.access_token,
        botUserId: tokenData.bot_user_id,
        teamId: tokenData.team.id,
        teamName: tokenData.team.name,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "SLACK_CONNECTED",
        userId: session.user.id,
        organizationId,
        metadata: {
          teamName: tokenData.team.name,
          teamId: tokenData.team.id,
        },
      },
    });

    redirect(`/dashboard/settings?slack_success=true`);
  } catch (error) {
    console.error("Slack OAuth callback error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
