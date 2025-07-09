import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import ConvexProvider from '../integrations/convex/provider.tsx'
import type { useUser } from '@clerk/clerk-react'

export const Route = createRootRouteWithContext<{
  user: ReturnType<typeof useUser>
}>()({
  component: () => (
    <>
      <ConvexProvider>
        <Outlet />
        <TanStackRouterDevtools />
      </ConvexProvider>
    </>
  ),
})
