import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {schemaTypes} from '../studio/schema.js';
const require=createRequire(import.meta.resolve('sanity'));
const {Schema}=await import(pathToFileURL(require.resolve('@sanity/schema')).href);
const schema=Schema.compile({name:'cash4gold',types:schemaTypes});
console.log('Compiled Sanity schema:',schemaTypes.length,'content types.');
if(!schema.get('page')||!schema.get('redirect'))throw new Error('Expected document types missing.');
