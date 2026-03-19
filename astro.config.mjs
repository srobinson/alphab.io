import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://srobinson.org",
  output: "static",
  image: { service: { entrypoint: "astro/assets/services/noop" } },
  integrations: [tailwind(), sitemap()],
});
