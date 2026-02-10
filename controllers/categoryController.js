import categoryModel from "../model/categoryModel.js";

// create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Category name is required",
      });
    }

    await categoryModel.create({ name });

    res.status(200).send({
      success: true,
      message: "New Category Created SuccessFully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in Create Category Api",
    });
  }
};

// get all category
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (categories.length === 0) {
      return res.status(500).send({
        success: false,
        message: "no category found ",
      });
    }

    res.status(200).send({
      success: true,
      message: "fetch all category successfully",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in get all Category Api",
    });
  }
};

// update category
export const updateCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "no category found",
      });
    }
    const { name } = req.body;
    if (name) category.name = name;
    await category.save();
    res.status(200).send({
      success: true,
      message: "category updated  successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in update Category Api",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "no category found",
      });
    }
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "category deleted  successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in delete Category Api",
    });
  }
};
