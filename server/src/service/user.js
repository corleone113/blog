import Base from './base';
import User from '../models/user';
export default class extends Base{
    constructor(model,query){
        super();
        this.Model=User;
        this.model=model;
        this.query=query;
    }
}