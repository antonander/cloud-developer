import { AxiosResponse } from 'axios';
import fs from 'fs';
import Jimp = require('jimp');
const axios = require('axios');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image or an error
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async (resolve, reject) => {
        // added axios to avoid 'Could not find MIME for Buffer <null>' error from Jimp
        axios({
            method: 'get',
            url: inputURL,
            responseType: 'arraybuffer'
        }).then(function ({data: imageBuffer} : AxiosResponse) {
            return Jimp.read(imageBuffer).then(url => {
                const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
                url
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(__dirname+outpath, (img)=>{
                    resolve(__dirname+outpath);
                });
            }).catch((error : string) => {
                reject(error)
            });
        }).catch((error : string)  => {
            reject(error)
        });

    });
}

// getTempFiles
// get files in the tmp directory
// helper function to get all files in the tmp directory (as array)
// useful to clean all files after tasks
// RETURNS
//    absolutePaths: Array<string> an array of absolute paths to files
export function getTempFiles() : string[]{
    const fileNames : string[] = fs.readdirSync(__dirname+"/tmp/");
    let absolutePaths : string[] = [];
    for( let file of fileNames) {
        absolutePaths.push(__dirname+"/tmp/"+file)
    }
    return absolutePaths;
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
    // remove the directory as well
    fs.rmdir(__dirname+"/tmp/", () => {})
}