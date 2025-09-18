import React, { useEffect, useState } from 'react';
import { Tree, Spin } from 'antd';

export default function AccountsTree({ treeData, loading, selected, onSelect }) {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const convertToTreeData = (data) => {
        if (!Array.isArray(data)) return [];
        const convertNode = (node) => ({
            title: `${node.account_code ?? ''} - ${node.name ?? ''}`,
            key: node.account_id,
            children: node.children ? node.children.map(convertNode) : [],
            data: node,
        });
        return data.map(convertNode);
    };

    const treeDataFormatted = convertToTreeData(treeData);

    // Expand all on initial load
    useEffect(() => {
        if (treeDataFormatted.length > 0) {
            const allKeys = [];
            const collect = (nodes) =>
                nodes.forEach((n) => {
                    allKeys.push(n.key);
                    if (n.children?.length) collect(n.children);
                });
            collect(treeDataFormatted);
            setExpandedKeys(allKeys);
        }
    }, [treeData]);

    // Auto-select + expand path if selected
    useEffect(() => {
        if (selected) {
            setSelectedKeys([selected]);

            const findPath = (nodes, targetId, path = []) => {
                for (let n of nodes) {
                    if (n.key === targetId) return [...path, n.key];
                    if (n.children?.length) {
                        const childPath = findPath(n.children, targetId, [...path, n.key]);
                        if (childPath) return childPath;
                    }
                }
                return null;
            };

            const pathKeys = findPath(treeDataFormatted, selected);
            if (pathKeys) {
                setExpandedKeys((prev) => Array.from(new Set([...prev, ...pathKeys])));
            }
        }
    }, [selected, treeDataFormatted]);

    const onExpand = (keys) => setExpandedKeys(keys);

    const onTreeSelect = (keys, info) => {
        setSelectedKeys(keys);
        if (onSelect && info.node) onSelect(info.node.data);
        setTimeout(() => {
            setSelectedKeys("");
        }, 150);

    };

    if (loading) {
        return (
            <div className="h-[410px] flex items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!treeDataFormatted?.length) {
        return (
            <div className="h-[410px] flex min-h-32 items-center justify-center text-gray-500">
                No Accounts Found
            </div>
        );
    }

    return (
        <div className="accounts-tree-preview flex flex-col gap-2">
            <h3 className="text-md font-semibold">Accounts Hierarchy Preview</h3>
            <div
                className='w-full h-[380px] overflow-auto p-2 rounded-s-lg shadow-sm border border-gray-200'>
                <Tree
                    treeData={treeDataFormatted}
                    expandedKeys={expandedKeys}
                    selectedKeys={selectedKeys}
                    onExpand={onExpand}
                    onSelect={onTreeSelect}
                    showLine
                    virtual={false}
                />
            </div>
        </div>
    );
}
