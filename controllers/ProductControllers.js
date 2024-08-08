const Product = require('../model/productModel');
const {StatusCodes} = require('http-status-codes');
const CustomErrors = require('../errors');
const path = require('path')


const createProduct = async(req, res) => {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);

    res.status(StatusCodes.OK).json({
        product
    })
};


const getAllProducts = async (req, res) => {
    const { category, name, sort, fields, numericFilters } = req.query;
    const queryObject = {};


    if (category) {
      queryObject.category = category;
    }
    if (name) {
      queryObject.name = { $regex: name, $options: 'i' };
    }
    if (numericFilters) {
      const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
      };
      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ['price', 'rating'];
      filters = filters.split(',').forEach((item) => {
        const [field, operator, value] = item.split('-');
        if (options.includes(field)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }
  
    let result = Product.find(queryObject).populate('reviews');
    // sort
    if (sort) {
      const sortList = sort.split(',').join(' ');
      result = result.sort(sortList);
    } else {
      result = result.sort('createdAt');
    }
  
    if (fields) {
      const fieldsList = fields.split(',').join(' ');
      result = result.select(fieldsList);
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const skip = (page - 1) * limit;
  
    result = result.skip(skip).limit(limit);
    // 23
    // 4 7 7 7 2
  
    const products = await result;
    res.status(200).json({ products, nbHits: products.length });
  };


const getSingleProduct = async(req, res) => {
    const {id : productId} = req.params;

    const product = await Product.findOne({_id : productId}).populate('reviews');

    if(!product){
        throw new CustomErrors.BadRequestError(`No item founded`)
    }
    res.status(StatusCodes.OK).json({
        product
    })
};


const updateProduct = async(req, res) => {
    const {
        user : {userId},
        params : {id : productId}
    } = req;

    const product = await Product.findOneAndUpdate(
        {_id : productId, user : userId},
        req.body,
        {runValidators : true,}
    )

    if(!product){
        throw new CustomErrors.BadRequestError("No item founded")
    }

    res.status(StatusCodes.OK).json({
        msg : "Product updated successfuly!",
        product
    })
};


const deleteProduct = async(req, res) => {
    const {
        user : {userId},
        params : {id : productId},
    } = req;

    const product = await Product.findByIdAndRemove({
        _id : productId,
        user : userId,
    })

    if(!product){
        throw new CustomErrors.BadRequestError("No item founded")
    }



    res.status(StatusCodes.OK).json({
        msg : "Product deleted successfuly"
    })
};


const uploadImage = async(req, res) => {
  if(!req.files){
      throw new CustomError.BadRequestError('No file Uploaded')
  }
  const productImage = req.files.img
          console.log(req.files.img)
  if (!productImage.mimetype.startsWith('image')) {
      throw new CustomError.BadRequestError('Please Upload Image');
  }
  const maxSize = 1024 * 1024;

  if (productImage.size > maxSize) {
      throw new CustomError.BadRequestError(
      'Please upload image smaller than 1MB'
  );    
  }
  const imagePath = path.join(
      __dirname,
      '../public/uploads/' + `${productImage.name}`
    );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
}




module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}