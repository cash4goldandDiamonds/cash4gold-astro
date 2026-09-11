import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {schemaTypes} from './studio/schema.js';
import {structure,pageTemplates} from './studio/structure.js';
const projectId=process.env.SANITY_STUDIO_PROJECT_ID;
const dataset=process.env.SANITY_STUDIO_DATASET;
if(!projectId||!dataset)throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET to your existing private Sanity project before starting Studio.');
// The CLI's /studio base path is the hosting prefix. Keeping this workspace at
// / avoids joining the same prefix twice (/studio/studio).
export default defineConfig({name:'cash4gold',title:'Cash 4 Gold & Diamonds',projectId,dataset,basePath:'/',plugins:[structureTool({structure})],schema:{types:schemaTypes,templates:existing=>[...existing,...pageTemplates]}});
