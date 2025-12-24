"use client";

import { api } from "@/trpc/react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { STRIPE_PRICES } from "@/lib/stripe-prices";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slack, Check, X as XIcon } from "lucide-react";
import { env } from "@/env";

export default function SettingsPage() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { addToast } = useToast();

  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const { data: profile, isLoading, refetch } = api.user.getProfile.useQuery();

  useEffect(() => {
    if (profile) {
      setFormData({ name: profile.name ?? "" });
    }
  }, [profile]);

  const updateProfileMutation = api.user.updateProfile.useMutation({
    onSuccess: () => {
      refetch();
      setEditMode(false);
      addToast("success", "Profile updated");
    },
    onError: (error) => {
      addToast("error", "Failed to update profile", error.message);
    },
  });

  const deleteAccountMutation = api.user.deleteAccount.useMutation({
    onSuccess: async () => {
      await authClient.signOut();
      router.push("/");
      addToast("success", "Account deleted");
    },
    onError: (error) => {
      addToast("error", "Failed to delete account", error.message);
    },
  });

  const createPortalMutation = api.user.createPortalSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      addToast("error", "Failed to open billing portal", error.message);
    },
  });

  const createCheckoutMutation = api.user.createCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      addToast("error", "Failed to start checkout", error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">{tCommon("error")}</p>
        </div>
      </div>
    );
  }

  const tier = profile.subscriptionTier ?? "FREE";
  const reviewsUsed = profile.reviewsThisMonth ?? 0;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileMutation.mutateAsync({ name: formData.name });
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  const handleUpgrade = (tierName: "STARTER" | "TEAM" | "BUSINESS") => {
    const priceId = STRIPE_PRICES[tierName].id;
    if (priceId) {
      createCheckoutMutation.mutate({ priceId });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">{t("profile.title")}</TabsTrigger>
          <TabsTrigger value="integrations">{t("integrations.title")}</TabsTrigger>
          <TabsTrigger value="billing">{t("subscription.title")}</TabsTrigger>
          <TabsTrigger value="account">{t("account.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>{t("profile.title")}</CardTitle>
              {!editMode && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setEditMode(true)}
                >
                  {tCommon("edit")}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {editMode ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("profile.name")}</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t("profile.email")}</Label>
                    <Input
                      type="email"
                      value={profile.email ?? ""}
                      disabled
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? tCommon("loading") : tCommon("save")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditMode(false);
                        setFormData({ name: profile.name ?? "" });
                      }}
                    >
                      {tCommon("cancel")}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>{t("profile.name")}</Label>
                    <p className="mt-1">{profile.name ?? "—"}</p>
                  </div>
                  <div>
                    <Label>{t("profile.email")}</Label>
                    <p className="mt-1">{profile.email ?? "—"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <SlackSettingsCard />
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{t("subscription.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t("subscription.currentTier")}</Label>
                <p className="mt-1 text-lg font-bold capitalize">
                  {tier.toLowerCase()}
                </p>
              </div>
              <div>
                <Label>{t("subscription.reviewsUsed")}</Label>
                {tier === "FREE" ? (
                  <div className="mt-2 space-y-2">
                    <Progress value={(reviewsUsed / 5) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {reviewsUsed} / 5 {t("subscription.reviewsUsedLabel")}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1">
                    {reviewsUsed} ({t("subscription.unlimited")})
                  </p>
                )}
              </div>
              {tier === "FREE" ? (
                <div className="space-y-3 mt-4">
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("STARTER")}
                    disabled={createCheckoutMutation.isPending}
                  >
                    {t("subscription.upgradePlan")} - Starter ($19/mo)
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("TEAM")}
                    disabled={createCheckoutMutation.isPending}
                  >
                    {t("subscription.upgradePlan")} - Team ($49/mo)
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => handleUpgrade("BUSINESS")}
                    disabled={createCheckoutMutation.isPending}
                  >
                    {t("subscription.upgradePlan")} - Business ($99/mo)
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => createPortalMutation.mutate()}
                  disabled={createPortalMutation.isPending}
                  className="mt-4"
                >
                  {createPortalMutation.isPending
                    ? tCommon("loading")
                    : t("subscription.manageSubscription")}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                {t("account.dangerZone")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t("account.deleteWarning")}
              </p>
              <Button
                variant="destructive"
                onClick={() => setDeleteAccountModalOpen(true)}
              >
                {t("account.deleteAccount")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ConfirmationModal
        open={deleteAccountModalOpen}
        onOpenChange={setDeleteAccountModalOpen}
        onConfirm={handleDeleteAccount}
        title={t("account.deleteAccount")}
        message={t("account.deleteConfirm")}
        confirmLabel={tCommon("delete")}
        cancelLabel={tCommon("cancel")}
        variant="danger"
        isLoading={deleteAccountMutation.isPending}
      />
    </div>
  );
}

function SlackSettingsCard() {
  const t = useTranslations("settings");
  const { addToast } = useToast();

  const { data: orgs } = api.organization.getMyOrganizations.useQuery();
  const defaultOrg = orgs?.[0];

  const { data: slackIntegration, refetch } = api.slack.getIntegration.useQuery(
    { organizationId: defaultOrg?.id ?? "" },
    { enabled: !!defaultOrg?.id }
  );

  const updateSettingsMutation = api.slack.updateSettings.useMutation({
    onSuccess: () => {
      refetch();
      addToast("success", "Slack settings updated");
    },
    onError: (error) => {
      addToast("error", "Failed to update settings", error.message);
    },
  });

  const disconnectMutation = api.slack.disconnect.useMutation({
    onSuccess: () => {
      refetch();
      addToast("success", "Slack disconnected");
    },
    onError: (error) => {
      addToast("error", "Failed to disconnect Slack", error.message);
    },
  });

  const handleToggle = (key: string, value: boolean) => {
    if (!defaultOrg?.id) return;
    updateSettingsMutation.mutate({
      organizationId: defaultOrg.id,
      [key]: value,
    });
  };

  const handleConnect = () => {
    if (!defaultOrg?.id) return;
    const slackClientId = env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    if (!slackClientId) {
      addToast("error", "Slack integration not configured");
      return;
    }
    const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/slack/callback`;
    const scope = "chat:write,channels:read,groups:read";
    const state = encodeURIComponent(defaultOrg.id);
    const url = `https://slack.com/oauth/v2/authorize?client_id=${slackClientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    window.location.href = url;
  };

  if (!defaultOrg) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Slack className="w-5 h-5" />
            {t("integrations.slack.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t("integrations.slack.noOrg")}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!slackIntegration) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Slack className="w-5 h-5" />
            {t("integrations.slack.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("integrations.slack.description")}
          </p>
          <Button onClick={handleConnect}>
            <Slack className="w-4 h-4 mr-2" />
            {t("integrations.slack.connect")}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Slack className="w-5 h-5" />
          {t("integrations.slack.title")}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" />
          {t("integrations.slack.connected")}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{slackIntegration.teamName}</p>
            {slackIntegration.defaultChannelName && (
              <p className="text-sm text-muted-foreground">
                #{slackIntegration.defaultChannelName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">{t("integrations.slack.notifications")}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyOnNew">{t("integrations.slack.notifyOnNew")}</Label>
              <Switch
                id="notifyOnNew"
                checked={slackIntegration.notifyOnNew}
                onCheckedChange={(checked) => handleToggle("notifyOnNew", checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyOnApproved">{t("integrations.slack.notifyOnApproved")}</Label>
              <Switch
                id="notifyOnApproved"
                checked={slackIntegration.notifyOnApproved}
                onCheckedChange={(checked) => handleToggle("notifyOnApproved", checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyOnRejected">{t("integrations.slack.notifyOnRejected")}</Label>
              <Switch
                id="notifyOnRejected"
                checked={slackIntegration.notifyOnRejected}
                onCheckedChange={(checked) => handleToggle("notifyOnRejected", checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifyOnComment">{t("integrations.slack.notifyOnComment")}</Label>
              <Switch
                id="notifyOnComment"
                checked={slackIntegration.notifyOnComment}
                onCheckedChange={(checked) => handleToggle("notifyOnComment", checked)}
                disabled={updateSettingsMutation.isPending}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              if (defaultOrg?.id) {
                disconnectMutation.mutate({ organizationId: defaultOrg.id });
              }
            }}
            disabled={disconnectMutation.isPending}
          >
            <XIcon className="w-4 h-4 mr-2" />
            {t("integrations.slack.disconnect")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
