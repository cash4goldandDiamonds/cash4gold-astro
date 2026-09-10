// Server build policy only. Explicit accesses let Astro resolve each private
// setting during static generation; passing import.meta.env wholesale omits
// settings that are not otherwise referenced by the compiled module.
export const buildEnvironment = {
  SITE_ENV: import.meta.env.SITE_ENV,
  ENABLE_PRODUCTION_INDEXING: import.meta.env.ENABLE_PRODUCTION_INDEXING,
  SANITY_PROJECT_ID: import.meta.env.SANITY_PROJECT_ID,
  SANITY_DATASET: import.meta.env.SANITY_DATASET,
  SANITY_PERSPECTIVE: import.meta.env.SANITY_PERSPECTIVE,
  ISOLATED_PRODUCTION_AUDIT: import.meta.env.ISOLATED_PRODUCTION_AUDIT,
  ASTRO_OUT_DIR: import.meta.env.ASTRO_OUT_DIR,
};
