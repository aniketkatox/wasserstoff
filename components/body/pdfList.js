import { useSession } from "next-auth/react"
import React, { useState } from "react";

//component to display PDF
const PDFViewer = ({ pdfUrl }) => {
    return (
        <iframe src= {pdfUrl} frameborder="0" height="1000px" width="100%"></iframe>
    );
};

export const PDFList = ({ pdfListProp }) => {
    const { data: session } = useSession();
    const [pdfUrl, setPDFUrl] = useState(null);

    const pdfFiles = pdfListProp.pdfFiles;

    //function to set the s3 pdf url
    async function openPDF(fileId){
        try{
            const url = "https://pdflist-storage.s3.ap-south-1.amazonaws.com/" + fileId;
            setPDFUrl(url);
        }
        catch  (error) {
            console.log("Error occured:", error);
        }
    }

    async function closePDF(){
        setPDFUrl(null);
    }


    if(pdfUrl == null){
        return (
            <div id="unauthorized-container" className="m-2 text-center mt-10">
                {!session && (
                    <div id="heading" className="text-2xl">
                        Please login to upload!
                    </div>
                )}
    
                <div id="pdf-list">
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>List of {pdfListProp.category} PDF Files:</h2>
                    <ul>
                        {pdfFiles.map((pdf, index) => (
                            <li key={index} onClick={() => openPDF(pdf.fileId)}>
                                {pdf.fileName}
                            </li>
                        ))}

                    </ul>
                </div>
            </div>
        )
    }else{
        return (
            <div id="pdf-viewer">
                <div id="close-button" className="text-center">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded m-2 mt-6" onClick={() => closePDF()}>Close PDF</button>
                </div>
                <div id="pdf-container" className="ml-40 mr-40">
                    {pdfUrl && <PDFViewer pdfUrl={pdfUrl} />}
                </div>
            </div>
        );
    }
}