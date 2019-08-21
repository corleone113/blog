import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import sinon from 'sinon';
import dirtyChai from 'dirty-chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

// Mocha / Chai
// ------------------------------------
mocha.setup({ ui: 'bdd', });
chai.should();

global.chai = chai;
global.expect = chai.expect;
global.sinon = sinon;

// Chai插件配置
chai.use(chaiEnzyme());
chai.use(dirtyChai);
chai.use(chaiAsPromised);
chai.use(sinonChai);

// 为enzyme配置React适配器
Enzyme.configure({
    adapter: new Adapter(),
});
export default Enzyme;