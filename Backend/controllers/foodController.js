import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food item

const addFood = async (req, res) => {

    

    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: image_filename,
        category: req.body.category,
    });
    try{
        await food.save();
        res.json({
            success: true,
            message: "Food item added successfully",
            food,
        });
    } catch (error) {
        console.error("Error adding food item:", error);
        res.json({
            success: false,
            message: "Failed to add food item",
            error: error.message,
        });
    }

}

//all food list
const listFood = async (req, res) => {
      try {
       const foods = await foodModel.find({});
        res.json({
            success: true,
            data:foods
          
        });
      } catch (error) {
        console.log("Error fetching food items:", error);
        res.json({
            success: false,
            message: "Failed to fetch food items",
            error: error.message,
        });
      }
}

//remove food item
const removeFood = async (req, res) => {
   try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`,()=>{});
// Delete the image file from the server

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({
        success: true,
        message: "Food item removed successfully",
    });
   } catch (error) {
      console.log(error)
      res.json({
          success: false,
          message: "Failed to remove food item",
          error: error.message,
      });
   }
}
export { addFood ,listFood ,removeFood};