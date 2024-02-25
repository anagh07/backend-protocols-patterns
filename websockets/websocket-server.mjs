import http from 'node:http';
import { server as WebSockerServer } from 'websocket';

const httpserver = http.createServer((req, res) => {
  console.log(`${new Date()}: Received request for ${req.url}`);
  res.writeHead(404);
  res.end();
});
httpserver.listen(8080, () => {
  console.log(`${new Date()}: Server listening on port 8080`);
});

let connections = [];

const websocket = new WebSockerServer({ httpServer: httpserver });
websocket.on('request', (request) => {
  const connection = request.accept(null, request.origin);

  connection.on('message', (message) => {
    connections.forEach((conn) =>
      conn.send(`User-${connection.socket.remotePort} says: ${message.utf8Data}`)
    );
  });

  connections.push(connection);
  connections
    .filter((conn) => conn != connection)
    .forEach((conn) => conn.send(`User-${connection.socket.remotePort} just connected!`));

  connection.on('close', (reasonCode, description) => {
    console.log(`${new Date()}: User-${connection.socket.remotePort} disconnected.`);
    connections = connections.filter((conn) => conn != connection);
  });
});
