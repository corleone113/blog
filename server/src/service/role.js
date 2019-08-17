import Base from './base';
import Role from '../models/role';
class RoleService extends Base {
    constructor() {
        super();
        this.Model = Role;
    }
}

export default new RoleService();