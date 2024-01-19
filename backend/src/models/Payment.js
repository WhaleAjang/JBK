const {default: mongoose} = require("mongoose");

const paymentSchema =  mongoose.Schema({
    user: {
        type: Object
    },
    data: {
        type: Array,
        default: []
    },
    product: {
        type: Array,
        default: []
    }
    //생성된 시간 자동으로 저장
}, {timestamps: true})


const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;