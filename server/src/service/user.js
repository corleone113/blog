import Base from './base';
import User from '../models/user';
class UserService extends Base {
    constructor() {
        super();
        this.Model = User;
    }
}
export default new UserService();