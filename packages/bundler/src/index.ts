import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { JSONRPCServer, TypedJSONRPCServer } from "json-rpc-2.0";

type Methods = {
  echo(params: {message: string}): string;
}

const jsonRpcServer: TypedJSONRPCServer<Methods> = new JSONRPCServer();

jsonRpcServer.addMethod("echo", ({ message }) => message);

const app = new Hono()
app.get('/', (c) => c.text('Hello Hono!'))

app.post('/rpc', async (c) => {
  const reqBody = await c.req.json();
  console.log("->", reqBody);
  return jsonRpcServer.receive(reqBody).then((response) => {
    console.log("<-", response);
    if (response) {
      return c.json(response);
    }
    return c.status(204);
  });
})

serve(app)
