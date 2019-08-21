import {
    actions,
    reducer,
} from '@/reducers/manageReducer';
import {
    manageActions,
} from '@/reducers/actionTypes';

//测试action函数和reducer函数。
describe('Redux测试', () => {
    it('action下的manage_set应该是一个函数', () => {
        expect(actions.manage_set).to.be.a('function');
    });

    it('action下的manage_set函数的返回值应带有指定值的type和传入的数据', () => {
        expect(actions.manage_set('people', {}, {})).have.property('type', manageActions.MANAGE_SET_REQ).property('entity', 'people');
    });

    it('manageReducers函数接收到MANAGE_RES动作会返回state和action.payload中整合的数据', () => {
        expect(reducer({
                name: 'corleone',
            }, {
                type: manageActions.MANAGE_RES,
                payload: {
                    job: 'coder',
                },
            })).have.property('name', 'corleone')
            .property('job', 'coder');
    });
});