import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {schemaTypes} from '../studio/schema.js';
const require=createRequire(import.meta.resolve('sanity'));
const {Schema}=await import(pathToFileURL(require.resolve('@sanity/schema')).href);
const {validateSchema,groupProblems}=await import(pathToFileURL(require.resolve('@sanity/schema/_internal')).href);
// Compilation alone accepts declarations that the browser Studio rejects.
// Run the same structural validation before reporting a usable editor schema.
const problems=groupProblems(validateSchema(schemaTypes).getTypes());
const errors=problems.flatMap(group=>group.problems.filter(problem=>problem.severity==='error').map(problem=>({path:group.path,message:problem.message})));
if(errors.length){console.error(JSON.stringify(errors,null,2));throw new Error('Sanity Studio schema validation failed.');}
const schema=Schema.compile({name:'cash4gold',types:schemaTypes});
console.log('Validated and compiled Sanity schema:',schemaTypes.length,'content types; 0 structural errors.');
if(!schema.get('page')||!schema.get('redirect'))throw new Error('Expected document types missing.');
