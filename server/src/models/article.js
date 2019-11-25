import mongoose from 'mongoose';
import articleSchema from '../schemas/article';
export default mongoose.model('Article', articleSchema);