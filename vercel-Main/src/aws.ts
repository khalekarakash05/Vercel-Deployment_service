import { S3 } from "aws-sdk";
import fs from "fs";

//initialize the s3 object
const s3= new S3({
    accessKeyId: "afa5512d3530b58fee59d6237ff96408",
    secretAccessKey: "4fddcb01a385a4b4b47d7db64c75942f79e74d92356adc762368be5fa7164aac",
    endpoint: "https://79dbe5d278dc43564906eba01385b4b2.r2.cloudflarestorage.com",
});

//fileName is a name which will be at the s3
//localFilePath is the path of the file which you want to upload
export const uploadFile = async(fileName: string, localFilePath: string)=>{
    //read the file content
    const fileContent = fs.readFileSync(localFilePath);
    //upload the file to s3
    const response = await s3.upload({
        Bucket: "vercel",
        Key: fileName,
        Body: fileContent
    }).promise();

    console.log("response => ",response);
}