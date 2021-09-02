const { BlobServiceClient } = require("@azure/storage-blob");
// const connStr = "DefaultEndpointsProtocol=https;AccountName=ventilatorblobs;AccountKey=KD6yOeibANuW9PAkl+FbkTEblxYYPufZ133K2E/NEZcqtoBuE2rmjcYesut0Lkki9e2Xnp9eu/xm3FNdWe2D+w==;EndpointSuffix=core.windows.net";
const connStr = "DefaultEndpointsProtocol=https;AccountName=dmblob;AccountKey=XKES7QwjBYPQLxgXE9QuLmiCqD5wq9fufMav3o83L6KE28ux56VHzNgLyMz9aHhxCjQGydRDJWKRmUUCI0zcsQ==;EndpointSuffix=core.windows.net";

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
// const containerName = "ventilatorblobc";
const containerName = "dmcontainer";

const fetchBlob = async () => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let blobs = containerClient.listBlobsFlat();
    
    for await (const blob of blobs) {
        const blobClient = containerClient.getBlobClient(`${blob.name}`);
        // Get blob content from position 0 to the end
        // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
        const downloadBlockBlobResponse = await blobClient.download();
        
        const downloaded = (await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)).toString();
        
        // Storing as JSON data:
        list = JSON.stringify(downloaded);
        myJSON = JSON.parse(list);

        const response = replaceAll(myJSON, "\r\n", ",")
        return JSON.parse(`[${response}]`);
        
        function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
        }
        
        // [Node.js only] A helper method used to read a Node.js readable stream into a Buffer
        async function streamToBuffer(readableStream) {
            return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream.on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream.on("error", reject);
            });
        }
    }
}

module.exports = fetchBlob