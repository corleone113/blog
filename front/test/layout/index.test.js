import React from 'react';
import { ArticleListCell, } from '@/components/article/Articles';
import Enzyme from '../setup';


const { shallow, } = Enzyme;

// 由于项目中许多UI组件时基于antd组件封装，这类组件没有单元测试的必要，这里测试的组件是完全基于react元素的，而下面代码是为了检测测试环境是否配置正确，真正的单元测试在后续TDD重构时再添加。
describe('UI组件单元测试示例', () => {
    let _props, _spies, _wrapper;
    // _menuparent,_itemOne, _itemTwo;
    beforeEach(() => {
        _spies = {};
        _props = {
            data: {
                time: '2019',
            },
            history: {
                push: (_spies.click = sinon.spy()),
            },
        };
        _wrapper = shallow(<ArticleListCell {..._props} />);
    });

    it('根节点为div标签', () => {
        expect(_wrapper.is('div')).to.equal(true);
    });

    it('该组件下应该有6个span标签', () => {
        expect(_wrapper.find('span').getElements().length).to.equal(6);
    });

    it('props中data以提供的属性值应和预期的一致', () => {
        expect(_wrapper.find('span').getElements()[0].props.children[2]).to.equal('2019');
    });

    it('props中data未提供的属性值应为undefined', () => {
        expect(_wrapper.find('span').getElements()[1].props.children[2]).to.equal(undefined);
    });

    it('点击组件时会触发传入的history.push方法', () => {
        _spies.click.should.have.not.been.called();
        _wrapper.simulate('click');
        _spies.click.should.have.been.called();
    });
});