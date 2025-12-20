"use server";

import { QueryClient } from "@tanstack/react-query";
import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { createCallerFactory } from "@/server/api/trpc";

const createQueryClient = () => new QueryClient();

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  const req = new Request("http://localhost:3000", { headers: heads });

  return createTRPCContext({
    req,
    resHeaders: new Headers(),
    info: {
      isBatchCall: false,
      calls: [],
      accept: "application/jsonl",
      type: "query" as const,
      connectionParams: {},
      signal: new AbortController().signal,
      url: new URL("http://localhost:3000"),
    },
  });
});

const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  createQueryClient
);
