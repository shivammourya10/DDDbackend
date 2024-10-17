import zod from 'zod';
import CategoryModel from '../../models/community/CategoryModel.js';

// Define Zod schemas for validation
const categoryIdParser = zod.string();
const userIdParser = zod.string(); // Assuming userId is also a string

const getTopics = async (req, res) => {
    console.log("first");
    const { categoryId, userId } = req.params;

    // Validate categoryId
    const isCategoryId = categoryIdParser.safeParse(categoryId);
    if (!isCategoryId.success) {
        return res.status(400).json({ message: 'Invalid category id' });
    }

    // Validate userId
    const isUserId = userIdParser.safeParse(userId);
    if (!isUserId.success) {
        return res.status(400).json({ message: 'Invalid user id' });
    }

    try {

        console.log("Category ID:", categoryId);
        console.log("User ID:", userId);

        const category = await CategoryModel.findById(categoryId).populate('topics'); 

        if (!category || !category.topics || category.topics.length === 0) {
            return res.status(404).json({ message: 'No topics found' });
        }

        return res.status(200).json({ message: 'Topics fetched successfully', category});
    } catch (error) {
        console.error("Error fetching topics:", error);
        return res.status(500).json({ message: 'Internal server error'});
    }
};
export default getTopics;