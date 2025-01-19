import fs from 'fs';
import path from 'path';


export const getAllFiles = (folderPath: string) => {
    let response: string[] = [];

    //getting all the files and folders inside main folder
    const AllFilesAndFolders = fs.readdirSync(folderPath);

    //iterating over all the files and folders
    AllFilesAndFolders.forEach((file) => {
        //getting the full path of the file
        const fullPath = path.join(folderPath, file);
        if(fs.statSync(fullPath).isDirectory()){
            //if the file is a folder, then recursively call the function
            response = response.concat(getAllFiles(fullPath));
        }
        else{
            //if the file is a file, then push it to the response array
            response.push(fullPath);
        }
    })
    return response;
}