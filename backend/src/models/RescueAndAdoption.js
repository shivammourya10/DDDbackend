import mongoose from "mongoose";

const rescueOrAdoptSchema = new mongoose.Schema(
    {
        typeOfHelp :{
            type: String,
            required: true,
            enum: ['Rescue', 'Adopt']
        },
        picUrl:{
            type : String,
            required: true,
        },
        description:{
            type : String,
            required: true,
        }
    }
)

export default mongoose.model("Rescue", rescueOrAdoptSchema);
