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
       const notification = await Notification.create({
         title: "New report created",
         message: `${populatedReport.title} was created.`,
         type: "reports",
       });
       io.to("admins").emit("newNotification", notification);
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
     const notification = await Notification.create({
       title: "Report updated",
       message: `${updatedReport.title} was updated.`,
       type: "reports",
     });
     io.to("admins").emit("newNotification", notification);
     res.status(201).json(updatedReport);
    }catch(error){
        console.log("Error updating report")
        res.status(501).json({message:"Error updating report"})
    }
}


export const deleteReport = async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedReport = await Report.findByIdAndDelete(id);
        const notification = await Notification.create({
          title: "Report deleted",
          message: `${deletedReport.title} was deleted.`,
          type: "reports",
        });
        const reportTitle = deletedReport ? deletedReport.title : "Unknown Report";
        const notificationMessage = `${reportTitle} was deleted.`;
        
        io.to("admins").emit("reportDeleted", id);
        io.to("admins").emit("newNotification", notification);
        if(!deletedReport){
            return res.status(404).json({message:"Report not found"})
        }else{
             return res.status(200).json(deletedReport);
        }
       
    }catch(error){
        console.log("Error deleting report",error.message)
        return res.status(500).json({message:"Error deleting report"})
    }
}

export const getReport = async(req,res)=>{
    try{
        const report = await Report.findById(req.params.id).populate("user","_id username email").lean();
        if(!report){
            res.status(404).json({message:"Report not found"})
        }else{
             res.status(201).json(report);
        }

    }catch(error){
        console.log("Error getting report",error.message)
        res.status(500).json
    }
}