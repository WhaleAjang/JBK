const {default: mongoose, Schema} = require("mongoose");

const productSchema =  mongoose.Schema({
    writer: {
        type: Schema.Types.ObjectId,
        //user 참조
        ref: "User"
    },
    title: {
        type: String,
        maxLength: 30
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        default: 0
    },
    continents: {
        //어떤 대륙 상품인지에대한 정보
        type: Number,
        default: 1
    },
    views: {
        //조회수
        type: Number,
        default: 0
    }
})

productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights : {
        title:5,
        description : 1
    }
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;