import express from 'express';
import petController from '../controller/PetControllers/PetController.js';
import { upload } from "../middlewares/multer.middleware.js";
import RescueAdoption from '../controller/RescueAndAdoptionController.js';
import updateBreedingStatus from '../controller/petMate/updateBreedingStatusController.js';
import returnPets from '../controller/PetControllers/ReturnPetsController.js';
import updatePet from '../controller/PetControllers/updatePetController.js';
import getRescueAndAdoption from '../controller/getRescueAndAdoption.js';


const router = express();
router.post("/:userId/createPets", upload.single("file"), petController);
router.post("/rescueAndAdoption", upload.single("file"), RescueAdoption);
router.put("/:petId/updateBreedingStatus", updateBreedingStatus);
router.get('/getRescueAndAdoption', getRescueAndAdoption);
router.put("/:petId/updatePet", upload.single("file"), updatePet);
router.get("/:userId/returnPets", returnPets);

export default router; 
