import Base from './base';
import Tag from '../models/tags';
class TagService extends Base {
    constructor() {
        super();
        this.Model = Tag;
    }
}
export default new TagService();