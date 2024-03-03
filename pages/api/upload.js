import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"
import generateGuid from "@/lib/guidGenerator";
import clientPromise from "./../../lib/mongodb";
import formidable from "formidable";
import fs from 'fs';
import path from "path";
import { file } from "jszip";
const { PDFDocument } = require('pdf-lib');
const AWS = require('aws-sdk');

export const config = {
    api: {
        bodyParser: false
    }
};

export default async (req, res) => {
    try {

        const session = await getServerSession(req, res, authOptions);

        if (session && req.method == "POST") {

            const email = session.user.email;
            const form = formidable({});    //for parsing form data
            let fields, files;
            [fields, files] = await form.parse(req);

            const uploadedFile = files.pdfFile;
            let filePath = uploadedFile[0].filepath;
            let newFilePath = filePath + '_new';

            const compressionEnabled = fields.enableCompression[0] == 'true' ? true : false;
            
            await sleep(100);

            if (compressionEnabled) {
                await decompressPDF(uploadedFile[0].filepath, newFilePath);
            }
            await sleep(100);

            AWS.config.update({
                region: process.env.AWS_S3_BUCKET_REGION,
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            });

            // Setting parameters about file for mongodb
            const pdfObject = {
                fileId: generateGuid() + ".pdf",
                uploadedBy: email,
                category: fields.category[0],
                fileName: uploadedFile[0].originalFilename,
            }

            if (compressionEnabled) {
                filePath = newFilePath;
            }


            // new instance of the S3 class
            const s3 = new AWS.S3();
        
            // Setting parameters for S3 file upload
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: pdfObject.fileId,
                Body: fs.createReadStream(filePath),
                ContentType: 'application/pdf',
            };

            // Upload the file to AWS S3
            await s3.upload(params, (err, data) => {
                if (err) {
                    console.log('Error uploading file:', err);
                } else {
                    console.log('File uploaded successfully. File location:', data.Location);
                    //fs.unlinkSync(filePath);
                }
            }).promise()

            // Insert file metadata into MongoDB collection
            const client = await clientPromise;
            const userDataDB = client.db("userAllData");
            const pdfStore = userDataDB.collection("pdfStore");
            await pdfStore.insertOne(pdfObject);

            res.send(
                {
                    status: true
                }
            )
            return;
        } else {    //if session is not active
            res.send(
                {
                    status: false
                }
            );
            return;
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ status: false });
        return;
    }
}

// function for delaying execution
function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// function to decompressing PDF file
async function decompressPDF(inputFilePath, outputFilePath) {
    try {
        var parentDir = path.resolve(process.cwd());
        console.log("cwd current : ",parentDir)
        const pdfBytes = fs.readFileSync(inputFilePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const modifiedPdfBytes = await pdfDoc.save({useObjectStreams: false});
        fs.writeFileSync(outputFilePath, modifiedPdfBytes);

        console.log('PDF decompressed successfully.');
    } catch (error) {
        console.error('Error decompressing PDF:', error);
    }
}