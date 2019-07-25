import Base from './base';
import RoleResource from '../models/role_resource';
class RoleResourceService extends Base {
    constructor() {
        super();
        this.Model = RoleResource;
    }
}
export default new RoleResourceService();