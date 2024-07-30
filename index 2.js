const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 3000;
let disabled;

// Initialize the WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('Client is ready!');

    // Fetch and log all available chats with names
    const chats = await client.getChats();
    chats.forEach(chat => {
        console.log(`Chat: ${chat.name}-${chat.id.user}`);
    });

    setInterval(()=>{sendMessages()},1000);
});

// Function to send 100 messages
const sendMessages = async () => {

    if(disabled){
        return;
    }

    const number = '6588248734'; // Replace with your friend's phone number
    const chatId = `${number}@c.us`;
    const message = 'Happy Birthday Nigger!!!!!!!!!!!!!!!! You are gay BTW!!!!!!';

    for (let i = 0; i < 10; i++) {
        await client.sendMessage(chatId, `${message}`);
        console.log(`Message ${i + 1} sent`);
    }

    await client.sendMessage('6588248734@c.us' , 'All messages sent , time: ' + new Date());
};

client.on('message', async (msg) => {
    const number = '6588248734'; // Replace with the phone number you want to monitor
    const chatId = `${number}@c.us`;

    if (msg.from === chatId) {
        if(msg.body === 'FUCK THAT NIGGER'){
            await sendMessages()
        }
        const reply = 'START: 200';
        await client.sendMessage(chatId, reply);
        console.log(`Sent reply to ${number}`);
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>WhatsApp Bot Control</title>
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>
            <div class="container mt-5">
                <h1 class="text-center">WhatsApp Bot Control</h1>
                <div class="text-center mt-5">
                    <button class="btn btn-success btn-lg" onclick="sendMessages()">Send Messages</button>
                    <button class="btn btn-danger btn-lg" onclick="killServer()">Kill Server</button>
                </div>
            </div>
            <script>
                function sendMessages() {
                    fetch('/send-messages', { method: 'POST' });
                }
                function killServer() {
                    fetch('/kill-server', { method: 'POST' });
                }
            </script>
        </body>
        </html>
    `);
});

// Endpoint to trigger sendMessages function
app.post('/send-messages', (req, res) => {
    sendMessages();
    res.send('Messages sent');
});

// Endpoint to kill the server
app.post('/kill-server', (req, res) => {
    res.send('Server shutting down');
    process.exit();
});

client.initialize();

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Start the WhatsApp client
