import Base from './base';
import Role from '../models/role';
export default class extends Base {
    constructor(model,query) {
        super(model,query);
        this.Model = Role;
    }
}