import mongoose from 'mongoose';
export default new mongoose.Schema({
    role_id: String, //角色-用户关联记录中对应的角色ID
    user_id: String //角色-用户关联记录中对应的用户ID
})