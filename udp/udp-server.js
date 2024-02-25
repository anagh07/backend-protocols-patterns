const dgram = require('dgram');

const port = 5512;
const addr = '127.0.0.1';

// Initialize the socket and listen on specified port and address
const server = dgram.createSocket({ type: 'udp4' });
server.bind(port, addr);
console.log(
`Listening for datagrams on ${addr}:${port}`
);

// Print received message along with the source address
server.on('message', (msg, info) => {
    console.log(`UDP datagram received from address: ${info.address}, port: ${info.port}`);
    console.log(`The message reads: ${msg}`);
});

