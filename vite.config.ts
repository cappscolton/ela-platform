import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { createRequire } from "module";
// TODO: This is a hack to fix a prisma issue that occurs in Prod (serverless edge environment)
// https://github.com/prisma/prisma/issues/12504
const prismaPlugin = () => {
  const require = createRequire(import.meta.url);
  const pathName = require
    .resolve("@prisma/client")
    .replace("@prisma/client/index.js", "");

  return {
    name: "prisma-vite-plugin",
    config: () => ({
      resolve: {
        alias: {
          ".prisma/client/edge": `${pathName}.prisma/client/edge`,
        },
      },
      server: {
      	port: 80
      }
    }),
  };
};

export default defineConfig({
  plugins: [sveltekit(), prismaPlugin()],
});
