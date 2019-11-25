import mongoose from 'mongoose';
import tagSchema from '../schemas/tags';
export default mongoose.model('Tag', tagSchema);