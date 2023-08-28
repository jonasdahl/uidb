# Ubiquiti UIDB Visualizer

The latest `main` branch code is automatically deployed to [ancient-brook-2300.fly.dev](https://ancient-brook-2300.fly.dev). The app is a single page application (SPA) but might transition into a server rendered app later on.

## Development and contribution

To get started developing the app, you'll need to install both [NodeJS](https://nodejs.org/en) (latest LTS) and npm. You should then be able to clone this repository, run `npm install` in the root of it, and then `npm run dev`. That will start the [Vite](https://vitejs.dev/) dev server, which is configured to hot reload on file changes.

### Styling

The project uses [Tailwind CSS](https://tailwindcss.com/) integrated with PostCSS into Vite for styling. As we're aiming to move over to our internal styling tools, please try to keep the usage to a minimum and if possible, place any style specific components in /src/components/ui.

### Routing

This app uses [React Router](https://reactrouter.com/en/main) and is currently a client side only SPA. To enable a future transition to SSR, please put new routes in `/src/routes` and follow the [Remix Flat Routes naming convention](https://github.com/kiliman/remix-flat-routes). React Router enables a `loader` function to be defined for each route, which will load the data required. The goal is to move those loader functions to the server, using either Next or Remix.

### Running tests

Start the interactive test runner with `npm run test`. The tests will automatically run in Github Actions when pushed. We use [vitest](https://vitest.dev/) as testing framework and [msw](https://mswjs.io/) for mocking external APIs. We're also aiming to add integration tests with Playwright or Cypress.

### Building the app

You can build (typecheck and generate the vite output) using `npm run build`. The files produced in `/dist` represents the full SPA.

## Docker and Fly.io

A docker image is built and deployed to Fly.io on every successful Github Actions pipeline run. See the Dockerfile in the root of the repository as reference. It basically serves the static files generated from `npm run build` using nginx.
