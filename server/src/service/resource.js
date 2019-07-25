import Base from './base';
import Resource from '../models/resource';
class ResourceService extends Base {
    constructor() {
        super();
        this.Model = Resource;
    }
}
export default new ResourceService();