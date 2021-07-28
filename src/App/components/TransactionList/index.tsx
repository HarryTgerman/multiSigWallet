import React from "react";
import BN from "bn.js";
import TransactionActions from "./TransactionActions";
import { useMultiSigWalletContext } from "../../../contexts/MultiSigWallet";
import { Table, Tag, Space } from "antd";

interface Transaction {
    txIndex: number;
    to: string;
    value: BN;
    data: string;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
}

interface Props {
    numConfirmationsRequired: number;
    count: number;
    data: Transaction[];
}



const TransactionList = () => {
    const { state } = useMultiSigWalletContext();


    const columns = [
        {
            title: 'Transaction Index',
            dataIndex: 'txIndex',
            key: 'txIndex',
        },
        {
            title: 'To',
            dataIndex: 'to',
            key: 'to',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'Value',
            render: (value: string) => value.toString()
        },
        {
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            render: (data: string) => <div >{data}</div>
        },
        {
            title: 'Executed',
            key: 'executed',
            dataIndex: 'executed',
            render: (bool: boolean) => bool ? <Tag color="green" >True</Tag> : <Tag color="loser">False</Tag>
        },
        {
            title: 'Confirmations',
            key: 'numConfirmations',
            dataIndex: 'numConfirmations',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, tx: Transaction) => (
                <Space size="middle">
                    <TransactionActions
                        numConfirmationsRequired={state.numConfirmationsRequired}
                        tx={tx}
                    />
                </Space>
            ),
        },
    ];

    return (<Table style={{ marginTop: "100px" }} columns={columns} dataSource={state.transactions} />);
};

export default TransactionList;