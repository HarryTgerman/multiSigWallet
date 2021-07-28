import React, { useState } from "react";
import { Modal, Form, Input, Alert } from "antd";
import useAsync from "../../../Hooks/useAsync";
import { useWeb3Context } from "../../../contexts/Web3";
import { submitTx } from "../../../api/multi-sig-wallet";
import { visible } from "ansi-colors";

interface Props {
    visible: boolean;
    onClose: (event?: any) => void;
}

interface SubmitTxParams {
    to: string;
    value: string;
    data: string;
}

const TxModal: React.FC<Props> = ({ visible, onClose }) => {
    const {
        state: { web3, account },
    } = useWeb3Context();

    const { pending, error, call } = useAsync<SubmitTxParams, any>(
        async (params) => {
            if (!web3) {
                throw new Error("No web3");
            }

            await submitTx(web3, account, params);
        }
    );

    const [inputs, setInputs] = useState({
        to: "",
        value: 0,
        data: "",
    });

    function onChange(name: string, e: React.ChangeEvent<HTMLInputElement>) {
        setInputs({
            ...inputs,
            [name]: e.target.value,
        });
    }

    async function onSubmit() {
        if (pending) {
            return;
        }

        const { error } = await call({
            ...inputs,
            value: inputs.value.toString(),
        });

        if (!error) {
            onClose();
        }
    }

    return (
        <Modal
            title="Create Transaction ?"
            visible={visible}
            onOk={onSubmit}
            confirmLoading={pending}
            onCancel={onClose}
            okText="Create"
        >
            {error && <Alert message={error.message} type="error" />}
            <Form layout="vertical">
                <Form.Item label="To">
                    <Input
                        type="text"
                        value={inputs.to}
                        onChange={(e) => onChange("to", e)}
                    />
                </Form.Item>
                <Form.Item label="Value">
                    <Input
                        type="number"
                        min={0}
                        value={inputs.value}
                        onChange={(e) => onChange("value", e)}
                    />
                </Form.Item>
                <Form.Item label="Data in HEX">
                    <Input
                        value={inputs.data}
                        onChange={(e) => onChange("data", e)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default TxModal;