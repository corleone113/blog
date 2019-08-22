import React from 'react';
import { Tree, Modal, } from 'antd';
const { TreeNode, } = Tree;
class ResourceModal extends React.Component {
    renderTree = (resources) => {
        return resources.map(resource => {
            const shouldDisable = resource.name === '权限管理' || resource.parent === '权限管理';
            if (resource.children.length > 0) {
                return (
                    <TreeNode title={resource.name} key={resource.name} disabled={shouldDisable}>
                        {this.renderTree(resource.children)}
                    </TreeNode>
                );
            } else {
                return <TreeNode title={resource.name} key={resource.name} disabled={shouldDisable} />;
            }
        });
    }
    render() {
        const { visible, onOk, onCancel, onCheck, checkedKeys, resources, } = this.props;
        return (
            <Modal
                title="设置权限"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
                destroyOnClose
            >
                <Tree
                    checkable
                    defaultExpandAll
                    onCheck={onCheck}
                    checkedKeys={checkedKeys}
                >
                    <TreeNode title="分配权限" key={0} disabled>
                        {this.renderTree(resources)}
                    </TreeNode>
                </Tree>
            </Modal>
        );
    }
}

export default ResourceModal;