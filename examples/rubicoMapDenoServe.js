import { serve } from "https://deno.land/std/http/server.ts";
import { map } from "https://deno.land/x/rubico/mod.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
map(req => {
  req.respond({ body: "Hello World\n" });
})(s);
