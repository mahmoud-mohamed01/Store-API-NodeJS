import { NotFound } from "../errors/index.js";
import Product from "../models/Product.js";

//ADD
async function AddProduct(req, res) {
  let { name, price, category } = req.body;
  let validtionErrors = validationResult(req);
  if (!validtionErrors.isEmpty()) {
    return res.status(422).json({ message: validtionErrors.array()[0] });
  }

  if (req.file == undefined) {
    return res.status(422).json({ message: "product image must be provided" });
  }

  const image =
    "http://localhost:3000" +
    req.file.path.replace(/\\/g, "/").substring("public".length);

  let product = new Product({
    name,
    image,
    price: parseInt(price),
    category,
  });
  await product.save();
  return res.json({ message: "product added succesfully" });
}

//Delete
async function deleteProduct(req, res) {
  let productId = req.params.id;
  try {
    await Product.findByIdAndDelete(productId);
    res.json({ message: "deleted succesfully" });
  } catch (error) {
    console.log(error);
  }
}

//get all products
async function getAllProducts(req, res) {
  try {
    let products = await Product.find();
    res.json({ products: products });
  } catch (error) {
    console.log(error);
  }
}

//update product by id

async function updateProductById(req, res) {
  const { id } = req.params;
  const { name, Price, newPrice, category } = req.body;

  let imageUrl;
  //check if there is a new image
  if (req.file !== undefined) {
    imageUrl =
      "http://localhost:5000" +
      req.file.path.replace(/\\/g, "/").substring("public".length);
  }

  try {
    let product = await Product.findById(id);

    //remove old image
    if (imageUrl != undefined) {
      let imageName = post.imageUrl.slice(22);

      console.log(imageName);

      fs.unlink(imageName, () => {});
    }
    product.name = name || product.name;
    product.oldPrice = Price || product.Price;
    product.newPrice = newPrice || product.newPrice;
    product.image = imageUrl || product.image;
    product.category = category || product.category;
    await product.save();
    res.json({ message: "product updated" });
  } catch (error) {
    console.log(error);
  }
}

//get product by id

async function getProductById(req, res) {
  let { id } = req.params;
  let product = await Product.findById(id);
  if (!product) {
    throw new NotFound("no product with this id");
  }
  return res.status(200).json({ product: product });
}

export {
  AddProduct,
  deleteProduct,
  getAllProducts,
  updateProductById,
  getProductById,
};
