# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Appwrite Setup

1. Create `.env` from `.env.example` and fill in your Appwrite instance data
1. Create Appwrite project with ID `607dd16494c6b`
2. Enter folder `cd appwrite`
3. Run `appwrite deploy collection` (you might need to install AppwriteCLI, do `appwrite client --endpoint YOUR_ENDPOINT` and `appwrite login`)
4. Manually create `postThumbnails` Storage Bucket with 10MB max size, extensions `png jpg jpeg` and `file-level` permissions
5. Enable `Google` OAuth in Users settings

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
