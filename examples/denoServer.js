import { serve } from "https://deno.land/std/http/server.ts";
import { map, transform } from "../rubico.js";
const s = serve({ port: 8001 });
console.log("http://localhost:8001/");
transform(map(req => {
  req.respond({ body: "Hello World\n" });
}), null)(s);
