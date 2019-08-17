import Base from './base';
import Article from '../models/article';
class ArticleService extends Base {
    constructor() {
        super();
        this.Model = Article;
    }
}
export default new ArticleService();