const CompanyModel = require("../models/company");
const messages = require("../utils/jsonMessages");


//Get a specific company from the database by name
exports.getCompany = async (req, res, next) => {
    try{
        console.log(req.body)
        const company = await CompanyModel.findOne({name: req.body.name})
        
        
        if(!company)
            return res  
            .status(404)
            .json({message:err.message})
        return res.status(200).json({
            company: company
        })    

    }catch(err){
        return res.status(500).json({message:err.message})
    }
};
//Get specific company from the database by id
exports.getCompanyById = async(req, res, next) =>{
    try{
        const company = await CompanyModel.findOne({_id:req.params.id})
        console.log(req.params.id)
        if(!company)
            return res 
            .status(404)
            .json({message:err.message})
        return res.status(200).json({
            company:company
        })

    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

//Delete a company
exports.deleteCompany = async(req,res, next) =>{
    try{
        CompanyModel.deleteOne({_id:req.params.id}, (err)=>{
            if(err){
                return res
                .status(500)
                .json({message:err.message})
            }
            return res.status(200).json({
                message:"deleted"
            })
        })


    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

//Update a company
exports.updateCompany = async(req,res,next) => {
    try{
        const company = await CompanyModel.findById(req.params.id).exec();
        if (!company) 
            return res.status(404).send('The product with the given ID was not found.');
            console.log(company)
        let query = {$set: {}};
        for (let key in req.body) {
            if (company[key] && company[key] !== req.body[key]) // if the field we have in req.body exists, we're gonna update it
                query.$set[key] = req.body[key];

        }
        const updateCompany = await CompanyModel.findOneAndUpdate({_id: req.params.id}, query).exec();
        console.log(updateCompany)
        res.send(updateCompany)
        
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}

//Add a new company to the DataBase
exports.postCompany = async(req, res, next) => {
    try{
        
        let newCompany =  new CompanyModel(req.body)
        console.log(req.body)
         await newCompany.save( (err, doc) =>{
            console.log("adicionado com sucesso")
            if(err){
                res.status(500).send("erro de bd")
            }else{
                res.send(doc)
            }
        })
    }catch(err){
        return res.status(500).json({message:err.message})
    }
}



