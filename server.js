import { serve } from "https://deno.land/std@0.103.0/http/server.ts";
import { multiParser } from "https://deno.land/x/multiparser@v2.1.0/mod.ts";

const server = serve({ port: 8080 });
const decoder = new TextDecoder();

let renderFile;
for await (const req of server) {

  /*  home page  */
  if (req.url == '/') {
    renderFile = await Deno.readFile('./index.html');
    req.respond({
      headers: new Headers({
        'content-type': 'text/html'
      }),
      body: decoder.decode(renderFile)
    });
  }
  
  /*  /upload route for uploading newick file  */
  if (req.url == '/upload' && req.method == 'POST') {
    const form = await multiParser(req);
    const newickString = decoder.decode(form.files.newickfile.content);
    const fileWritePromise = Deno.writeTextFile("./tree.nwk", newickString);
    req.respond({
      status: 303,
      headers: new Headers({
        location: "/"
      })
    });
  }
  
  /*  serve the newick file for fetch() calls  */
  if (req.url == '/tree.nwk') {
    renderFile = await Deno.readFile('./tree.nwk');
    req.respond({
      headers: new Headers({
        'content-type': 'text/plain'
      }),
      body: decoder.decode(renderFile)
    });
  }
  
  /*  static serving for all files in the /stylesheets and /scripts directories  */
  if (req.url.includes('/stylesheets/')) {
    let filename = './' + req.url.substr(1, req.url.length);
    renderFile = await Deno.readFile('./stylesheets/app.css');
    req.respond({
      headers: new Headers({
        'content-type': 'text/css'
      }),
      body: decoder.decode(renderFile)
    });
  }
  if (req.url.includes('/scripts/')) {
    let filename = './' + req.url.substr(1, req.url.length);
    renderFile = await Deno.readFile(filename);
    req.respond({
      headers: new Headers({
        'content-type': 'application/javascript'
      }),
      body: decoder.decode(renderFile)
    });
  }

  /*  serve the favicon  */
  if (req.url == '/favicon.ico') {
    const favicon = await Deno.readFile('./virus.svg');
    req.respond({
      headers: new Headers({
        'content-type': 'image/svg+xml'
      }),
      body: favicon
    });
  }
}

