import React, { useState } from "react";
import { message, Modal, Form, Input, Alert } from "antd";
import useAsync from "../../../Hooks/useAsync";
import { useWeb3Context } from "../../../contexts/Web3";
import { changeOwner } from "../../../api/multi-sig-wallet";
import Web3 from "web3";
import BN from "bn.js";

interface Props {
    visible: boolean;
    onClose: (event?: any) => void;
}


interface SubmitChangeOwnerParams {
    value: BN,
    data: string
}


const ChangeOwnerModal: React.FC<Props> = ({ visible, onClose }) => {
    const {
        state: { web3, account },
    } = useWeb3Context();

    const { pending, error, call } = useAsync<SubmitChangeOwnerParams, any>(
        async (params) => {
            if (!web3) {
                throw new Error("No web3");
            }

            await changeOwner(web3, account, params);
        }
    );

    const [inputs, setInputs] = useState({
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
        if (inputs.value < 4) {
            return message.error("Send at least 4 ETH to become owner")
        }
        if (pending) {
            return;
        }

        const transformedInput = Web3.utils.toWei(`${inputs.value}`, "ether")
        const value = Web3.utils.toBN(transformedInput);
        const { error } = await call({
            value: value,
            data: inputs.data
        });

        if (error) {
            message.error(error.message);
        } else {
            setInputs({
                value: 0,
                data: "",
            });
            onClose();
        }

    }

    return (
        <Modal
            title="Become owner"
            visible={visible}
            onOk={onSubmit}
            confirmLoading={pending}
            onCancel={onClose}
            okText="Become Owner"
        >
            {error && <Alert message={error.message} type="error" />}
            <Form layout="vertical">
                <Form.Item label="Pay 4 Ether to Replace last Owner">
                    <Input
                        type="number"
                        min={4}
                        value={inputs.value}
                        onChange={(e) => onChange("value", e)}
                    />
                </Form.Item>
                <Form.Item label="State something about you">
                    <Input
                        value={inputs.data}
                        onChange={(e) => onChange("data", e)}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangeOwnerModal;