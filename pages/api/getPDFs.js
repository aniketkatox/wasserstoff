import clientPromise from "./../../lib/mongodb";

export default async (req, res) => {
    try{
        const categoryFilter = req.query.categoryFilter;

        //connect to the MongoDB client
        const client = await clientPromise;
        const userDataDB = await client.db("userAllData");
        const pdfStore = userDataDB.collection("pdfStore");

        let pdfDocuments;

        if(categoryFilter == 'all'){
            pdfDocuments = await pdfStore.find().toArray();
        }else{  //filtered by category
            pdfDocuments = await pdfStore.find({ "category" : categoryFilter }).toArray();
        }

        res.send({
                status : true,
                pdfDocuments : pdfDocuments
            }
        );

    }catch (e){
        console.log("Server side execution!");
        return {
            props: {
                demoQuestions : "it's me!"
            }
        };
    }
}