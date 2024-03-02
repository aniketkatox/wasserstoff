import React, { useState } from 'react';
import axios from 'axios';
import { PDFDocument } from 'pdf-lib';

export const Form = ({ fromProp }) => {
    const [category, setCategory] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [compressionEnabled, setCompressionEnabled] = useState(true);

    const getPDFFiles = fromProp.getPDFFiles;

    const handleCheckboxChange = (event) => {
        setCompressionEnabled(event.target.checked);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handlePdfFileChange = async (e) => {
        const file = e.target.files[0];
        if (compressionEnabled) {
            const compressedFile = await compressFile(file);
            setPdfFile(compressedFile);
        } else {
            setPdfFile(file);
        }
    };

    // function to compress before uploading
    const compressFile = async (file) => {
        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);
    
            const compressedPdfBytes = await pdfDoc.save();
            const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
            const compressedFile = new File([compressedPdfBytes], file.name, { type: compressedBlob.type });
    
            return compressedFile;
        } catch (error) {
            console.error('Error compressing PDF:', error);
            throw error;
        }
    };

    //function to submit form
    const submitForm = async () => {
        const formData = new FormData();    //to handle data from HTML forms
        formData.append('category', category);
        formData.append('pdfFile', pdfFile);
        formData.append('enableCompression', compressionEnabled);

        try {
            alert("File is uploading...")
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Response from server:', response.data);
            getPDFFiles();  //calling this function so that pdf Files state will update
        } catch (error) {
            console.error('Error uploading PDF:', error.message);
        }
    };

    return (
        <div id="authorized-container" className="m-2 text-center">
            <form>
                <div>
                    <h2 className="font-bold text-4xl mb-2 mt-3">PDF Upload Form</h2>
                    <div>
                        <label className='font-bold'>Category: </label>

                        <select className="mt-1 py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                            value={category}
                            onChange={handleCategoryChange}
                        >
                            <option value="" >Select Category</option>
                            <option value="education" >Education</option>
                            <option value="business" >Business</option>
                            <option value="technology">Technology</option>
                        </select>
                    </div>

                    <div className='m-2'>
                        <input
                            id="checkbox"
                            type="checkbox"
                            checked={compressionEnabled}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="checkbox" className='font-bold'> Enable Compression</label>

                    </div>

                    <div className='m-2'>
                        <label className='font-bold'>Choose PDF File: </label>
                        <input type="file" accept=".pdf" onChange={handlePdfFileChange} />
                    </div>

                    <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded" onClick={submitForm}>
                        Upload PDF
                    </button>
                </div>
            </form>
        </div>
    )
}
