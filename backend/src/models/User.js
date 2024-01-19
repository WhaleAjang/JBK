const {default: mongoose} = require("mongoose");
const bcrypt = require('bcryptjs');

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        trim: true, //빈칸 없애줌
        unique: true,
    },
    password: {
        type: String,
        minLength: 5,
    },
    role: {
        type: Number,
        default: 0, // 0 : 일반유저
    },
    image: String,
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    }
})


userSchema.pre('save', async function(next) {
    let user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    //next 호출해야 넘어감
    next(); 
})

userSchema.methods.comparePassword = async function(plainPassword){
    let user = this;
    //console.log(user);
    //plainPassword와 user 안에 있는 hash된 비밀번호 비교 일치하면 match = true
    const match = bcrypt.compare(plainPassword,user.password)
    return match
}

const User = mongoose.model("User", userSchema);

module.exports = User;