import { serve } from "https://deno.land/std/http/server.ts";
import { map, transform } from "../mod.js"
const s = serve({ port: 8001 })
console.log("http://localhost:8001/");
transform(null, map(req => {
  req.respond({ body: "Hello World\n" });
}))(s);
