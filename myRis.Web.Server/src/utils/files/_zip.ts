
import fs from "fs";
import archiver from "archiver";

archiver.registerFormat('zip-encryptable', require("archiver-zip-encryptable"));

export const compressDir = (srcDir: string, destZipPath: string, password: string): Promise<any> => {

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destZipPath);
  
    var archive = archiver('zip-encryptable', {
      zlib: { level: 5 },
      forceLocalTime: true,
      password: password
    });
  
    output.on('close', resolve);
  
    archive.on('error', reject);
  
    archive.pipe(output);
  
    archive.directory(srcDir, false);
  
    archive.finalize();
  
    console.log("compressDir: ", destZipPath);
  })
};