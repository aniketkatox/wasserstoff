import { useSession } from "next-auth/react"
import { PDFList } from "./pdfList"
import { Form } from "./form"

export const Body = ({bodyProp}) => {
    const { data: session } = useSession();
    const pdfFiles = bodyProp.pdfFiles;
    const getPDFFiles = bodyProp.getPDFFiles;
    const category = bodyProp.category;

    const pdfListProp = {
        pdfFiles,
        category
    }

    const fromProp = {
        getPDFFiles
    }

    return (
        <div id="body">
            {session && <Form fromProp={fromProp} />}
            <PDFList pdfListProp={pdfListProp} />
        </div>
    );
    
}