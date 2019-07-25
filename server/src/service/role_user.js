import Base from './base';
import RoleUser from '../models/role_user';
class RoleUserService extends Base {
    constructor() {
        super();
        this.Model = RoleUser;
    }
}
export default new RoleUserService();