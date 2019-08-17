import mongoose from 'mongoose';
export default new mongoose.Schema({
    name: String, // 资源名称
    parent: String, // 资源之间存在父子关系，parent_id表示父级资源的id
    route: String, // 资源对应的路由
    icon: String, // 资源图标名称
});