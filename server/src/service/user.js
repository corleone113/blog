import Base from './base';
import User from '../models/user';
export default class extends Base {
    constructor(model,query) {
        super(model,query);
        this.Model = User;
    }
}