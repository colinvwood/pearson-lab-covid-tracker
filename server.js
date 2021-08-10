import { serve } from "https://deno.land/std@0.103.0/http/server.ts";
import { multiParser } from "https://deno.land/x/multiparser@v2.1.0/mod.ts";

const server = serve({ port: 8080 });
const decoder = new TextDecoder();

let renderFile;
for await (const req of server) {
  if (req.url == '/') {
    renderFile = await Deno.readFile('./index.html');
    req.respond({
      headers: new Headers({
        'content-type': 'text/html'
      }),
      body: decoder.decode(renderFile)
    });
  }
  if (req.url == '/file' && req.method == 'POST') {
    const form = await multiParser(req);
    const newickString = decoder.decode(form.files.newickfile.content);
    const fileWritePromise = Deno.writeTextFile("./tree.nwk", newickString);
    req.respond({
      headers: new Headers({
        'content-type': 'text/html'
      }),
      body: "thx for the file"
    });
  }
  
  if (req.url == '/stylesheets/app.css') {
    renderFile = await Deno.readFile('./stylesheets/app.css');
    req.respond({
      headers: new Headers({
        'content-type': 'text/css'
      }),
      body: decoder.decode(renderFile)
    });
  }
  if (req.url == '/scripts/app.js') {
    renderFile = await Deno.readFile('./scripts/app.js');
    req.respond({
      headers: new Headers({
        'content-type': 'application/javascript'
      }),
      body: decoder.decode(renderFile)
    });
  }
}

