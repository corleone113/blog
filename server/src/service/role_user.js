import Base from './base';
import RoleUser from '../models/role_user';
export default class extends Base {
    constructor(model, query) {
        super(model, query);
        this.Model = RoleUser;
    }
}