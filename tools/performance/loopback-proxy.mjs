import http from 'node:http';
import assert from 'node:assert/strict';

// Chrome must use this proxy even for loopback. It forwards only to the one
// static lab origin; HTTPS tunnels and upgraded connections are always denied.
export async function startLoopbackProxy(origin){
 const target=new URL(origin);assert.equal(target.hostname,'127.0.0.1');assert.equal(target.protocol,'http:');
 const deniedOrigins=new Set();
 const server=http.createServer((request,response)=>{
  let url;try{url=new URL(request.url);}catch{response.writeHead(400).end();return;}
  if(url.origin!==origin||url.username||url.password||!['GET','HEAD'].includes(request.method)){
   deniedOrigins.add(url.origin);response.writeHead(403).end('Blocked by isolated audit proxy');return;
  }
  const upstream=http.request(origin+url.pathname+url.search,{method:request.method,headers:{...request.headers,host:target.host}},result=>{
   response.writeHead(result.statusCode,result.headers);result.pipe(response);
  });
  upstream.on('error',()=>{if(!response.headersSent)response.writeHead(502);response.end();});upstream.end();
 });
 server.on('connect',(request,socket)=>{deniedOrigins.add('https://'+request.url.split('/')[0]);socket.end('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');});
 server.on('upgrade',(_request,socket)=>socket.destroy());
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 return {port:server.address().port,deniedOrigins,async close(){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}};
}
