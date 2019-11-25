import Base from './base';
import Resource from '../models/resource';
class ResourceService extends Base {
    constructor() {
        super();
        this.Model = Resource;
    }

    getTrees(resources) {
        const menus = new Set();
        const map = {};
        resources = resources.map(resource => {
            const r = resource;
            map[r.name] = r;
            r.children = [];
            return r;
        });
        resources.forEach(resource => {
            if (!resource.parent) {
                menus.add(resource);
            } else if (resource.parent && map[resource.parent].parent) {
                const parent = map[resource.parent];
                parent.children.push(resource);
                menus.add(parent);
            } else {
                map[resource.parent].children.push(resource);
            }
        });
        return Array.from(menus);
    }
}
export default new ResourceService();