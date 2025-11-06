import { redis } from "../lib/redis.js";
import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    console.log("getAllProducts called ✅");
    const products = await Product.find({});
    console.log("Products found:", products);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getAllProducts controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }

    // if not in redis, fetch from mongodb
    // .lean() is gonna return a plain javascript object instead of a mongodb document
    // which is good for performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    // store in redis for future quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = new Product({
      name,
      description,
      price,
      imageUrl: cloudinaryResponse ? cloudinaryResponse.secure_url : null,
    });

    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("deleted image from cloduinary");
      } catch (error) {
        console.log("error deleting image from cloduinary", error);
      }

      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products= await Product.aggregate([
      { $sample: { size: 5 } },
      {
        $project: {
          name:1,
          description:1,
          price:1,
          image:1
        }
      }
    ])
    
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json(products);
    
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
   if (product) {
			product.isFeatured = !product.isFeatured;
			const updatedProduct = await product.save();
			await updateFeaturedProductsCache();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
    
  } catch (error) {
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error updating featured products cache:", error.message);
  } 
}