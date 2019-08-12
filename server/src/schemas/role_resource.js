import mongoose from 'mongoose';
export default new mongoose.Schema({
    role_id: String, //角色-资源关联记录中对应的角色ID
    resource_id: String, //角色-资源关联记录中对应的资源ID
});