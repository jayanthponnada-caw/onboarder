# TanStack React Start Quickstart

_Last reviewed for this repository: 2026-06-01_

This file is a Clerk/TanStack Start reference quickstart, not the authoritative
project architecture document. The current repository already has the relevant
pieces in:

```txt
apps/web/src/start.ts
apps/web/src/integrations/clerk/provider.tsx
apps/web/src/integrations/clerk/header-user.tsx
apps/web/src/routes/sign-in.$.tsx
apps/web/src/routes/sign-up.$.tsx
apps/core/src/index.ts
```

Use `@clerk/tanstack-react-start` in `apps/web` and `@clerk/hono` in
`apps/core`. The Core Hono app serves oRPC OpenAPI routes under `/api/*`;
Inngest is served separately at `/inngest`.

**Example Repository**

- [TanStack React Start Quickstart Repo](https://github.com/clerk/clerk-tanstack-react-start-quickstart)

1. ## Create a new TanStack React Start app

   If you don't already have a TanStack React Start app, run the following commands to [create a new one](https://tanstack.com/start/latest/docs/framework/react/getting-started).

   ```npm
   npm create @tanstack/start@latest clerk-tanstack-react-start
   cd clerk-tanstack-react-start
   npm install
   ```
2. ## Install `@clerk/tanstack-react-start`

   The [Clerk TanStack React Start SDK](https://clerk.com/docs/reference/tanstack-react-start/overview.md) gives you access to prebuilt components, hooks, and helpers to make user authentication easier.

   Run the following command to install the SDK:

   filename: terminal

   ```npm
   npm install @clerk/tanstack-react-start
   ```

   ## Set your Clerk API keys

   Add the following keys to your `.env` file. These keys can always be retrieved from the [**API keys**](https://dashboard.clerk.com/~/api-keys) page in the Clerk Dashboard.

   filename: .env

   ```sh
   CLERK_PUBLISHABLE_KEY={{pub_key}}
   CLERK_SECRET_KEY={{secret}}
   ```
3. ## Add `clerkMiddleware()` to your app

   [clerkMiddleware()](https://clerk.com/docs/reference/tanstack-react-start/clerk-middleware.md) grants you access to user authentication state throughout your app. It also allows you to protect specific routes from unauthenticated users. To add `clerkMiddleware()` to your app, follow these steps:

   1. Create a `src/start.ts` file with the following code:

      filename: src/start.ts

      ```tsx
      import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
      import { createStart } from '@tanstack/react-start'

      export const startInstance = createStart(() => {
        return {
          requestMiddleware: [clerkMiddleware()],
        }
      })
      ```

   2. By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes. See the [clerkMiddleware() reference](https://clerk.com/docs/reference/tanstack-react-start/clerk-middleware.md) to learn how to require authentication for specific routes.
4. ## Add `<ClerkProvider>` to your app

   The [<ClerkProvider>](https://clerk.com/docs/tanstack-react-start/reference/components/clerk-provider.md) component provides session and user context to Clerk's hooks and components. It's recommended to wrap your entire app at the entry point with `<ClerkProvider>` to make authentication globally accessible. See the [reference docs](https://clerk.com/docs/tanstack-react-start/reference/components/clerk-provider.md) for other configuration options.

   Add the `<ClerkProvider>` component to your app's root route, as shown in the following example:

   filename: src/routes/\_\_root.tsx

   ```tsx
   import { ClerkProvider } from '@clerk/tanstack-react-start'
   import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
   import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

   import Header from '../components/Header'

   import appCss from '../styles.css?url'

   export const Route = createRootRoute({
     head: () => ({
       meta: [
         {
           charSet: 'utf-8',
         },
         {
           name: 'viewport',
           content: 'width=device-width, initial-scale=1',
         },
         {
           title: 'TanStack Start Starter',
         },
       ],
       links: [
         {
           rel: 'stylesheet',
           href: appCss,
         },
       ],
     }),

     shellComponent: RootDocument,
   })

   function RootDocument({ children }: { children: React.ReactNode }) {
     return (
       <html lang="en">
         <head>
           <HeadContent />
         </head>
         <body>
           <ClerkProvider>
             <Header />
             {children}
           </ClerkProvider>
           <TanStackRouterDevtools />
           <Scripts />
         </body>
       </html>
     )
   }
   ```
5. ## Protect your pages
6. ### Client-side

   To protect your pages on the client-side, you can use Clerk's [prebuilt control components](https://clerk.com/docs/tanstack-react-start/reference/components/overview.md#control-components) that control the visibility of content based on the user's authentication state.

   The following example uses the following components:

   - [<Show when="signed-in">](https://clerk.com/docs/tanstack-react-start/reference/components/control/show.md): Children of this component can only be seen while **signed in**.
   - [<Show when="signed-out">](https://clerk.com/docs/tanstack-react-start/reference/components/control/show.md): Children of this component can only be seen while **signed out**.
   - [<UserButton />](https://clerk.com/docs/tanstack-react-start/reference/components/user/user-button.md): Shows the signed-in user's avatar. Selecting it opens a dropdown menu with account management options.
   - [<SignInButton />](https://clerk.com/docs/tanstack-react-start/reference/components/unstyled/sign-in-button.md): An unstyled component that links to the sign-in page. In this example, since no props or [environment variables](https://clerk.com/docs/guides/development/clerk-environment-variables.md) are set for the sign-in URL, this component links to the [Account Portal sign-in page](https://clerk.com/docs/guides/account-portal/overview.md#sign-in).
   - [<SignUpButton />](https://clerk.com/docs/tanstack-react-start/reference/components/unstyled/sign-up-button.md): An unstyled component that links to the sign-up page. In this example, since no props or [environment variables](https://clerk.com/docs/guides/development/clerk-environment-variables.md) are set for the sign-up URL, this component links to the [Account Portal sign-up page](https://clerk.com/docs/guides/account-portal/overview.md#sign-up).

   filename: src/routes/index.tsx

   ```tsx
   import { UserButton, Show, SignInButton, SignUpButton } from '@clerk/tanstack-react-start'
   import { createFileRoute } from '@tanstack/react-router'

   export const Route = createFileRoute('/')({
     component: Home,
   })

   function Home() {
     return (
       <div>
         <h1>Index Route</h1>
         <Show when="signed-in">
           <UserButton />
         </Show>
         <Show when="signed-out">
           <SignInButton />
           <SignUpButton />
         </Show>
       </div>
     )
   }
   ```
7. ### Server-side

   To protect your routes, create a [server function](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions) that checks the user's authentication state via the [auth()](https://clerk.com/docs/reference/tanstack-react-start/auth.md) method. If the user is not authenticated, they are redirected to a sign-in page. If authenticated, the user's `userId` is passed to the route, allowing access to the `<Home />` component, which welcomes the user and displays their `userId`. The [`beforeLoad()`](https://tanstack.com/router/latest/docs/framework/react/api/router/RouteOptionsType#beforeload-method) method ensures authentication is checked before loading the page, and the [`loader()`](https://tanstack.com/router/latest/docs/framework/react/api/router/RouteOptionsType#loader-method) method returns the user data for use in the component.

   > Ensure that your app has the [TanStack Start server handler](https://tanstack.com/start/latest/docs/framework/react/guide/server-routes#handling-server-route-requests) configured in order for your server routes to work.

   filename: src/routes/index.tsx

   ```tsx
   import { createFileRoute, redirect } from '@tanstack/react-router'
   import { createServerFn } from '@tanstack/react-start'
   import { auth } from '@clerk/tanstack-react-start/server'

   const authStateFn = createServerFn().handler(async () => {
     const { isAuthenticated, userId } = await auth()

     if (!isAuthenticated) {
       // This will error because you're redirecting to a path that doesn't exist yet
       // You can create a sign-in route to handle this
       // See https://clerk.com/docs/tanstack-react-start/guides/development/custom-sign-in-or-up-page
       throw redirect({
         to: '/sign-in',
       })
     }

     return { userId }
   })

   export const Route = createFileRoute('/')({
     component: Home,
     beforeLoad: async () => await authStateFn(),
     loader: async ({ context }) => {
       return { userId: context.userId }
     },
   })

   function Home() {
     const state = Route.useLoaderData()

     return <h1>Welcome! Your ID is {state.userId}!</h1>
   }
   ```
8. ## Run your project

   Run your project with the following command:

   ```npm
   npm run dev
   ```
9. ## Create your first user

   1. Visit your app's homepage at http://localhost:3000.
   2. Select "Sign up" on the page and authenticate to create your first user.

   > To make configuration changes to your Clerk development instance, claim the Clerk keys that were generated for you by selecting **Configure your application** in the bottom right of your app. This will associate the application with your Clerk account.

## Next steps

Learn more about Clerk components, how to build custom authentication flows, and how to use Clerk's client-side helpers using the following guides.

- [Prebuilt components](https://clerk.com/docs/reference/components/overview.md): Learn how to quickly add authentication to your app using Clerk's suite of components.
- [Customization & localization](https://clerk.com/docs/guides/customizing-clerk/appearance-prop/overview.md): Learn how to customize and localize Clerk components.
- [Create a custom sign-in-or-up page](https://clerk.com/docs/tanstack-react-start/guides/development/custom-sign-in-or-up-page.md): Learn how to create a custom sign-in-or-up page with Clerk components.
- [Protect content and read user data](https://clerk.com/docs/tanstack-react-start/guides/users/reading.md): Learn how to use Clerk's hooks and helpers to protect content and read user data in your TanStack React Start app.
