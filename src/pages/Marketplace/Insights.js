/* eslint-disable */
import React from 'react'
import { Table, Tag, Space } from 'antd';

const columns = [
    {
        title: 'Insights',
        dataIndex: 'insights',
        key: 'insights',
    },
    {
        title: 'New',
        dataIndex: 'new',
        key: 'new',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    }
];

const data = [
    {
        key: '1',
        insights: 'Residents',
        new: 12,
        total: 2977,
    },
    {
        key: '2',
        new: 49,
        insights: 'Block',
        total: 193,
    },
    {
        key: '3',
        insights: 'Post',
        new: 18,
        total: 91239,
    },
    {
        key: '4',
        insights: 'Comments',
        new: 158,
        total: 19092,

    }, {
        key: '5',
        insights: 'Available Tokens',
        new: '',
        total: '15997250 MVPC',

    }, {
        key: '6',
        insights: 'Total Token Supply',
        new: '',
        total: '100000000 MVPC',

    },
];
export default ({ insights }) => {
    return <Table columns={columns} dataSource={insights} />
}
