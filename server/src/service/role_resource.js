import Base from './base';
import RoleResource from '../models/role_resource';
export default class extends Base {
    constructor(model, query) {
        super(model, query);
        this.Model = RoleResource;
    }
}