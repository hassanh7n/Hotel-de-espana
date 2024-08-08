const mongoose = require('mongoose');


const ProductModel = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please provide Products name"],
        maxlength : [50, "Connot axceed more than 50 charcaters"],
    },
    price : {
        type : Number,
        required : [true, "Please provide products price"]
    },
    image : {
        type : String,
        required : [true, "Please provide products image"],
        default: '/uploads/example.jpeg',
    },
    category : {
        type : String,
        required : [true, "Please provide Products category"],
        enum : ['chinese', 'sea', 'desi', 'turkish', 'spanish', 'italian', 'german', 'mexican'],
        default : 'desi'
    },
    averageRating: {
        type: Number,
        default: 0,
      },
      numOfReviews: {
        type: Number,
        default: 0,
      },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},
{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);



ProductModel.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false,
  });
  
  ProductModel.pre('remove', async function (next) {
    await this.model('Review').deleteMany({ product: this._id });
  });



module.exports = mongoose.model("Products", ProductModel);