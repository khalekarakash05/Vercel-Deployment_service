const express = require("express");
const app = express();
const cors = require("cors");
import simplegit from "simple-git";
import path, { resolve } from "path";
import { generate } from "./utils";
import { getAllFiles } from "./file";
import { S3 } from "aws-sdk";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

app.use(cors());
app.use(express.json());

//for testing
// uploadFile("dist/package.json","/home/akash/vercel-Main/dist/output/guzyk/package.json" )

app.post("/deploy", async (req: { body: { repoUrl: any; }; }, res: { json: (arg0: {}) => void; }) => {
    const repoUrl = req.body.repoUrl;
    console.log("repourl", repoUrl);
    const id = generate();
    await simplegit().clone(repoUrl, path.join(__dirname, `output/${id}`))
    console.log("repourl", repoUrl);
    // console.log(repoUrl);
    const files = getAllFiles(path.join(__dirname, `output/${id}`));

    console.log("Files", files);
    //upload all the files to s3
    files.forEach(async(file: string) => {
        await uploadFile(file.slice(__dirname.length+1), file);
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))
    console.log("Files after uploades");
    publisher.lPush("build-queue",id);
    console.log("Files after push");
    publisher.hSet("status", id, "uploaded");
    console.log("Files after status");

    res.json({
        id: id
    }); 
    
})


import { Request, Response } from "express";

app.get("/status", async(req: Request, res: Response) => {
    const id = req.query.id;
    const response = await subscriber.hGet("status", id as string);

    res.json({
        status: response
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});


// const s3= new S3({
    // accessKeyId: "afa5512d3530b58fee59d6237ff96408",
    // secretAccessKey: "4fddcb01a385a4b4b47d7db64c75942f79e74d92356adc762368be5fa7164aac",
    // endpoint: "https://79dbe5d278dc43564906eba01385b4b2.r2.cloudflarestorage.com"
// });