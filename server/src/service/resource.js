import Base from './base';
import Resource from '../models/resource';
export default class ResourceService extends Base {
    constructor(model,query) {
        super(model,query);
        this.Model = Resource;
    }
}