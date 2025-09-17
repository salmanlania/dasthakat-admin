import React, { useEffect, useRef, useState } from 'react';
import { Tree, Spin } from 'antd';

export default function AccountsTreeZoomable({ treeData, loading, onSelect }) {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const [scale, setScale] = useState(0.9);
    const [origin, setOrigin] = useState('0 0');
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [dragging, setDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    const wrapperRef = useRef(null);

    const convertToTreeData = (data) => {
        if (!Array.isArray(data)) return [];
        const convertNode = (node) => ({

            title: `${node.account_code ?? ''} - ${node.name ?? ''}`,
            key: node.account_id,
            children: node.children ? node.children.map(convertNode) : [],
            data: node,
        });
        console.log(data)
        return data.map(convertNode);
    };

    const treeDataFormatted = convertToTreeData(treeData);

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

    const onExpand = (keys) => setExpandedKeys(keys);

    const onTreeSelect = (keys, info) => {
        setSelectedKeys(keys);
        if (onSelect && info.node) onSelect(info.node.data);
    };

    const resetZoom = () => {
        setScale(0.9);
        setTranslate({ x: 0, y: 0 });
        setOrigin('0 0');
    };

    // Dragging
    const handleMouseDown = (e) => {
        setDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = (e) => {
        if (!dragging) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = () => setDragging(false);



    if (loading) {
        return (
            <div className="flex min-h-32 items-center justify-center">
                <Spin size="large" />
            </div>
        );
    }

    if (!treeDataFormatted?.length) {
        return (
            <div className="flex min-h-32 items-center justify-center text-gray-500">
                No accounts found
            </div>
        );
    }

    return (
        <div className="accounts-tree-preview" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="text-md font-semibold">Accounts Hierarchy Preview</h3>

            </div>

            <div
                ref={wrapperRef}
                style={{
                    height: 400,
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: 'white',
                    cursor: dragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className='relative h-full'>
                    <div className=' p-3' style={{
                        transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                        transformOrigin: origin,
                        transition: dragging ? 'none' : 'transform 0.08s linear',
                    }}>

                        <Tree
                            treeData={treeDataFormatted}
                            expandedKeys={expandedKeys}
                            selectedKeys={selectedKeys}
                            onExpand={onExpand}
                            onSelect={onTreeSelect}
                            showLine
                            defaultExpandAll
                            virtual={false}
                        />
                    </div>

                    <div className="flex gap-1 bg-white/70 backdrop-blur-md px-2 py-3 rounded-md items-center absolute top-1 right-1">
                        <div className='text-xs'>Zoom: {(scale * 100).toFixed(0)}%</div>
                        <button type="button" className='w-6 h-6 rounded-md bg-gray-100 active:bg-blue-300' onClick={() => setScale((s) => Math.min(3, s + 0.1))}>+</button>
                        <button type="button" className='w-6 h-6 rounded-md bg-gray-100 active:bg-blue-300' onClick={() => setScale((s) => Math.max(0.4, s - 0.1))}>-</button>
                        <button type="button" className='text-xs' onClick={resetZoom}>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
