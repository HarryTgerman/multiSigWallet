import React from "react";
import { unlockAccount } from "../api/web3";
import useAsync from "../Hooks/useAsync";
import "./index.css"
import { useWeb3Context } from "../contexts/Web3";
import MultiSigWallet from "./components/MultiSigWallet";
// import Footer from "./Footer";
// import Network from "./Network";
import { Layout, Avatar, Menu, Button, Typography, List, message } from 'antd';
import { GithubOutlined, UserOutlined } from '@ant-design/icons';
import TransactionList from "./components/TransactionList";


const { Header, Footer, Content } = Layout;
const { Title } = Typography;

function App() {
  const {
    state: { account, netId },
    updateAccount,
  } = useWeb3Context();

  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
      message.error(error)
    }
    if (data) {
      updateAccount(data);
    }
  }


  if (!account) {
    return (
      <Layout className="layout">
        <Header>
          <Menu mode="horizontal" style={{ textAlign: "right" }}  >
            <Menu.Item > <Button onClick={() => onClickConnect()}
              disabled={pending}
              loading={pending}>Authenticate</Button> </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Title level={2}>Please connect your Metamask</Title>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Coded By Harry Trippel <a target="_blank" href="https://github.com/harrytgerman/"> <GithubOutlined /> </a></Footer>
      </Layout>
    );
  }


  return (
    <div className="App">
      <header className="App-header">
      </header>
      <Layout className="layout">
        <Header>
          <Menu theme="dark" mode="horizontal" style={{ textAlign: "right" }}  >
            <Menu.Item  ><Avatar size={32} icon={<UserOutlined />} /> {account}</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Title>Multi Signature Wallet</Title>
            <MultiSigWallet />
            <TransactionList />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Coded By Harry Trippel <a target="_blank" href="https://github.com/harrytgerman/"> <GithubOutlined /> </a></Footer>
      </Layout>,
    </div>
  );
}

export default App;
