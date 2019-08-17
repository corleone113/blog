/**
 * 用户的表结构
 */
import mongoose from 'mongoose';

export default new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    gender: Number,
    website: String,
    phone: String,
    address: String,
    role: String,
});