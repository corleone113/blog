import mongoose from 'mongoose';
import User from '../schemas/users';
export default mongoose.model('User', User);