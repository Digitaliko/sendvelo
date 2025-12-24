import { createTRPCRouter } from "./trpc";
import { reviewRouter } from "./routers/review";
import { userRouter } from "./routers/user";
import { organizationRouter } from "./routers/organization";
import { slackRouter } from "./routers/slack";

export const appRouter = createTRPCRouter({
  review: reviewRouter,
  user: userRouter,
  organization: organizationRouter,
  slack: slackRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
