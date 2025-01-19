const express = require("express");
const { S3 } = require("aws-sdk");
const app = express();


interface RequestWithHostname extends Express.Request {
    headers: any;
    secure: boolean;
    hostname: string;
    path: string;
}

interface ResponseWithSend extends Express.Response {
    send: (body?: any) => ResponseWithSend;
    set: (field: string, value?: string | string[]) => ResponseWithSend;
}

const s3= new S3({
    accessKeyId: "afa5512d3530b58fee59d6237ff96408",
    secretAccessKey: "4fddcb01a385a4b4b47d7db64c75942f79e74d92356adc762368be5fa7164aac",
    endpoint: "https://79dbe5d278dc43564906eba01385b4b2.r2.cloudflarestorage.com"
});

app.get("/*", async(req: RequestWithHostname, res: ResponseWithSend) => {
    //id.vercel.com
    const host = req.hostname;
    console.log("host", host);
    const id = host.split(".")[0];
    console.log("id", id);
    const filepath = req.path;
    // console.log("here is filepath", filepath);

    const contents = await s3.getObject({
        Bucket: "vercel",
        Key: `dist/${id}${filepath}`
    }).promise();

    const type = filepath.endsWith("html") ? "text/html" : 
                filepath.endsWith("css") ? "text/css" : 
                "application/javascript";

    res.set("Content-Type", type);
    res.send(contents.Body);


})


app.listen(3001, () => {
        console.log("Server is running on port 3000");
    }
)