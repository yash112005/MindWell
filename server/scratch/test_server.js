const http = require('http');

async function testServer() {
    const data = JSON.stringify({
        message: "Hello"
    });

    const options = {
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            // We need a token since it's protected
            // 'Authorization': 'Bearer ...' 
        }
    };

    console.log("Testing POST /api/chat (should fail with 401 but confirm server is up)...");
    const req = http.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.on('error', (error) => {
        console.error("Server connection error:", error.message);
    });

    req.write(data);
    req.end();
}

testServer();
