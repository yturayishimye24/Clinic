import Report from "../models/reportModel.js"

export const createReport = async(req,res)=>{
    try{
       const {title,body,conclusion} = req.body;
       const newReport = new Report({
           title,
           body,
           conclusion,
           createdBy: req.user._id
       })
       const savedReport = await newReport.save();
       const populatedReport = await Report.findById(savedReport._id).populate("createdBy","username email");
       res.status(201).json(populatedReport);
    }catch(error){
        console.log("Error creating report",error.message)
        res.status(500).json({message:"Error creating report"})
    }
}

export const displayReport = async(req,res)=>{
    try{
        const report = await Report.find().sort({createdAt:-1}).populate("createdBy","username email").lean();
        if(report){
            res.status(201).json(report);
        }
    }catch(error){
        console.log("Error creating report",error.message)
        res.status(500).json({message:"Error creating report"})
    }
}

export const updateReport = async(req,res) =>{
    try{
     const {id} = req.params;
     const {title,body,conclusion} = req.body;
     const updatedReport = await Report.findByIdAndUpdate(id,{title,body,conclusion},{new:true})
     res.status(201).json(updatedReport);
    }catch(error){
        console.log("Error updating report")
        res.status(501).json({message:"Error updating report"})
    }
}

