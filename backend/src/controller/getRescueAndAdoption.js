import RescueAndAdoption from '../models/RescueAndAdoption.js';

const getRescueAndAdoption = async(req,res)=>{
    const rescueAndAdoption =await RescueAndAdoption.find({});
    if(!rescueAndAdoption){
        return res.status(404).json({message: 'No rescue and adoption data found'});
    }
    res.json({message: 'Rescue and adoption data fetched successfully', rescueAndAdoption});
}

export default getRescueAndAdoption;