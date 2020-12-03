/* eslint-disable */
import React from 'react'
import { Table, Button } from 'antd';

const columns = [
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Identity',
        dataIndex: 'identity',
        key: 'identity',
    },
    {
        title: 'Balance',
        dataIndex: 'balance',
        key: 'balance',
        render: text => <a>{text} BCG</a>,

    }
];

export default ({ supporters, signSupport }) => {
    return (
        <>
            <Button style={{ height: '38px' }} type='primary' onClick={signSupport}>Sign as Supporter</Button>
            <Table style={{ width: '100%' }} columns={columns} dataSource={supporters} />
        </>
    )
}
