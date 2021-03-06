import React, { useState } from "react";
import Web3 from "web3";
import BN from "bn.js";
import { Button, List, Typography, Statistic, Row, Col, Modal, InputNumber, message } from "antd";
import { deposit } from "../../../api/multi-sig-wallet";
import { useMultiSigWalletContext } from "../../../contexts/MultiSigWallet";
import { useWeb3Context } from "../../../contexts/Web3";
import useAsync from "../../../Hooks/useAsync";
import TxModal from "../TransactionModal";
import ChangeOwnerModal from "../ChangeOwnerModal";

// import DepositForm from "./DepositForm";
// import CreateTxModal from "./CreateTxModal";
// import TransactionList from "./TransactionList";


interface Props { }

interface DepositParams {
    web3: Web3;
    account: string;
    value: BN;
}


export default function MultiSigWallet() {
    const {
        state: { web3, account },
    } = useWeb3Context();
    const { state } = useMultiSigWalletContext();

    const { pending, call } = useAsync<DepositParams, void>(
        ({ web3, account, value }) => deposit(web3, account, { value })
    );

    const [changeOwner, openChangeOwner] = useState(false);
    const [open, openModal] = useState(false);
    const [input, setInput] = useState("");
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async () => {
        setConfirmLoading(true);

        if (pending) {
            return;
        }

        if (!web3) {
            message.error("No web3");
            return;
        }

        const transformedInput = web3.utils.toWei(`${input}`, "ether")
        const value = Web3.utils.toBN(transformedInput);
        const zero = Web3.utils.toBN(0);

        if (value.gt(zero)) {
            const { error } = await call({
                web3,
                account,
                value,
            });

            if (error) {
                message.error(error.message);
            } else {
                setInput("");
                setConfirmLoading(false);
                setVisible(false)
            }
        }

    };

    const handleCancel = () => {
        setVisible(false);
    };


    return (
        <div>
            <Typography.Title level={3}>Contract: {state.address}</Typography.Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="Balance Ether" value={web3?.utils.fromWei(state.balance, "ether")} precision={2} />
                </Col>
                <Col span={8}>
                    <Statistic title="Confirmations required" value={state.numConfirmationsRequired} />
                </Col>
                <Col span={8}>
                    <Statistic title="Transactions" value={state.transactionCount} />
                </Col>
            </Row>
            <List
                itemLayout="horizontal"
                header={<Typography.Title level={3}>Owners</Typography.Title>}
                footer={<div>
                    <Button type="primary" onClick={showModal}>Deposit Ether</Button>
                    <Button style={{ marginLeft: "8px" }} type="primary" onClick={() => openModal(true)}>Create Transaction</Button>
                    <Button style={{ marginLeft: "8px" }} type="primary" onClick={() => openChangeOwner(true)}>Become Owner</Button>
                </div>}

                dataSource={state.owners}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={item === account ? <Typography.Text type="success" >{item}</Typography.Text> : item}
                            description={Web3.utils.isHex(state.ownerData[index]) ? Web3.utils.hexToAscii(state.ownerData[index]) : "NOT HEX"}
                        />
                    </List.Item>
                )}
            />
            <Modal
                title="How much Ether do you want to deposit ?"
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                okText="Deposit"
            >
                <InputNumber value={input} onChange={setInput} />
            </Modal>
            <TxModal visible={open} onClose={() => openModal(false)} />
            <ChangeOwnerModal visible={changeOwner} onClose={() => openChangeOwner(false)} />
        </div>
    );
}
