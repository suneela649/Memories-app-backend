const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');
let responseData;
let DB_NAME = "memories";
let COLLECTION_NAME = "memories-list"
async function main() {
    const uri = `mongodb+srv://saisuneela24:kZjidp69U5aQj5ud@cluster0.wzmgnbt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        
    } finally {
        await client.close();
    }
}


main().catch(console.error);

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (req.url === '/api') {
        
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });    
        const uri = `mongodb+srv://saisuneela24:kZjidp69U5aQj5ud@cluster0.wzmgnbt.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
        const client = new MongoClient(uri);
        try {
            await client.connect();
            responseData = await getMemoriesFromMongoDB(client)
            res.end(JSON.stringify(responseData))
        } finally {
            await client.close();
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(" <h1> 404 Nothing Found </h1>")
    }
});

async function getMemoriesFromMongoDB(client) {
    const cursor = client.db(DB_NAME).collection(COLLECTION_NAME)
        .find();
    const results = await cursor.toArray();
    if (results.length > 0) {
        
        return results;
    } else {
        
    }
}
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Our server is running on port: ${PORT}`));
