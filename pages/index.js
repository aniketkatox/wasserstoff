import { Body } from "@/components/body/body";
import { Header } from "@/components/navBar/header";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [pdfFiles, setPDFFiles] = useState([]);

	//function to fetch PDF files
	async function getPDFFiles(){
		try {
			const response = await axios.get('/api/getPDFs?categoryFilter=' + selectedCategory);
			setPDFFiles(response.data.pdfDocuments);
		} catch (error) {
			console.error('Error:', error);
		}
	}

	useEffect(() => {
		getPDFFiles();
	}, [selectedCategory]);

	const category = selectedCategory;
	var bodyProp = {
        pdfFiles,
        setSelectedCategory,
		getPDFFiles,
		category
    }

	const headerProp = {
		setSelectedCategory
	}

	return (
		<main>
			<Header headerProp={ headerProp }/>
			<Body bodyProp={ bodyProp } />
		</main>
	);
}