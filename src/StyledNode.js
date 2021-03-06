/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import styled from "@emotion/styled";
import 'antd/dist/antd.min.css';
import { Row, Col, Input, Menu, Dropdown, Button, message, Space, Tooltip, InputNumber } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import pic from "./static/img/pp-avatar.png";
import "./style/style.css";
// import { Tree, TreeNode } from "react-organizational-chart";

import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react';
import { addNode, deleteNode, deleteTree, changeIncomeInfo, unRegNode, regNode } from './redux'
// import { type } from '@testing-library/user-event/dist/type';

import ChildInfoGiver from './components/ChildInfoGiver';

import store from './redux/store';

const StyledNodeDiv = styled.div`
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  border: 1px solid red;
  background-color: rgb(230,230,230);
  width: fit-content;
  height: 150px;
  border: 0px solid ;
  display: inline-block;
  margin: 0px;
  padding-left: 10px;
`;

const btnStyle = 'background: rgba(0,0,0,0) !important; border: 0px solid rgba(0,0,0,0);';

const StyledNode = (props) => {
    let state_nodes = useSelector(state => state.nodes);
    let your_node = state_nodes.find(element => element.tree_id === props.tree_id && element.node_id === props.node_id)
    let your_total_income = your_node.total_income;
    let username = your_node.username;
    let self_income = your_node.self_income;
    // let your_registration = your_node.registered;

    // const [username, setUsername] = useState("");
    // const [self_income, setSelf_Income] = useState(0);
    // // const [total_income, setTotal_Income] = useState(0);
    // setSelf_Income(your_node.self_income);
    // setUsername(your_node.username);

    const prev_username = useRef("");
    // const prev_self_income = useRef(0);
    // const total_income_input = useRef(0);

    const dispatch = useDispatch();

    // const [isRegistered, setIsRegistered] = useState(true);
    // if (your_node.isRegistered === false) {
    //     setIsRegistered(current => current = false);
    // }

    let child_node = ChildInfoGiver(props.tree_id);

    let areAllChildsRegistered = true;

    let sumOfYourChildsTotals = 0;
    let youSummedThemAll = true;

    let unReggedItAlready = false;
    let alreadyReggedChild = true;

    let youAlreadyDispatchedYourselfWithChildrenUpdates = true;

    for (let n = 0; n < state_nodes.length; n++) {
        if (state_nodes[n].tree_id === props.tree_id && state_nodes[n].parent_id === props.node_id && state_nodes[n].node_id !== props.node_id && state_nodes.length > 1) {
            areAllChildsRegistered = areAllChildsRegistered && state_nodes[n].registered;
        }
    }

    if (!areAllChildsRegistered) {
        for (let a = 0; a < state_nodes.length; a++) {
            if (state_nodes[a].tree_id === props.tree_id && state_nodes[a].parent_id === props.node_id && state_nodes[a].node_id !== props.node_id && state_nodes.length > 1) {
                sumOfYourChildsTotals += state_nodes[a].total_income;
                dispatch(unRegNode(props.tree_id, props.node_id));
                dispatch(regNode(state_nodes[a].tree_id, state_nodes[a].node_id));
                youAlreadyDispatchedYourselfWithChildrenUpdates = false;
            }
        }
    }

    if (!youAlreadyDispatchedYourselfWithChildrenUpdates) {
        if (props.node_id === 1) {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, username, true, self_income, sumOfYourChildsTotals));
        } else {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, username, false, self_income, sumOfYourChildsTotals));
        }
        youAlreadyDispatchedYourselfWithChildrenUpdates = true;
    }


    const detectNameChange = (e) => {
        // dispatch(unRegNode(props.tree_id, props.node_id));
        // console.log(event.target.value);
        for (let i = 0; i < state_nodes.length; i++) {
            // console.log(state_nodes[i].total_income);
            if (state_nodes.length >= 2) {
                if (state_nodes[i].tree_id === props.tree_id && state_nodes[i].parent_id === props.node_id && state_nodes[i].node_id !== props.node_id && state_nodes[i].total_income !== null) {
                    // console.log("xcvxcvxvc");
                    console.log("asdasd " + state_nodes[i].total_income);
                    sumOfYourChildsTotals += state_nodes[i].total_income;
                }
            }
        }
        youSummedThemAll = true;
        console.log(self_income + "   and " + sumOfYourChildsTotals);
        if (props.node_id === 1) {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, e.target.value, true, self_income, sumOfYourChildsTotals));
        } else {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, e.target.value, false, self_income, sumOfYourChildsTotals));
        }
        username = e.target.value;
    }

    const detectIncomeChange = (e) => {
        // dispatch(unRegNode(props.tree_id, props.node_id));
        for (let i = 0; i < state_nodes.length; i++) {
            // console.log(state_nodes[i].total_income);
            if (state_nodes.length >= 2) {
                if (state_nodes[i].tree_id === props.tree_id && state_nodes[i].parent_id === props.node_id && state_nodes[i].node_id !== props.node_id && state_nodes[i].total_income !== null) {
                    // console.log("xcvxcvxvc");
                    console.log("asdasd " + state_nodes[i].total_income);
                    sumOfYourChildsTotals += state_nodes[i].total_income;
                }
            }
        }
        youSummedThemAll = true;
        console.log(self_income + "   and " + sumOfYourChildsTotals);
        if (props.node_id === 1) {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, username, true, e.target.value, sumOfYourChildsTotals));
        } else {
            dispatch(changeIncomeInfo(props.tree_id, props.node_id, username, false, e.target.value, sumOfYourChildsTotals));
        }
        self_income = e.target.value;
    }

    function handleMenuClick(e) {
        switch (e.key) {
            case '1':
                dispatch(addNode(props.tree_id, props.node_id, child_node));
                break;
            case '2':
                dispatch(deleteNode(props.tree_id, props.node_id));
                if (props.node_id === 1) {
                    dispatch(deleteTree(props.tree_id));
                }
                break;
            default:
                break;
        }
    }

    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    label: 'Add a downline',
                    key: '1',
                },
                {
                    label: 'Delete',
                    key: '2',
                },
                {
                    label: "Register Income",
                    key: "3"
                }
            ]}
        />
    );

    return (
        <StyledNodeDiv>
            <div className="card">
                <Row>
                    <Space align="center">
                        <Col span={1}>
                            <img alt="profile" src={pic} />
                        </Col>
                        <Col span={22}>
                            <Input value={username} onChange={detectNameChange} placeholder="Name" />
                        </Col>
                        <Col span={1}>
                            <Dropdown overlay={menu} placement="bottomLeft" arrow>
                                <Button css={css`${btnStyle}`}>&#10247;</Button>
                            </Dropdown>
                        </Col>
                    </Space>
                </Row>
                <Row>
                    <Col span={4} css={css`display:flex;align-items:center;`}>
                        <label htmlFor="sef">Self  :  </label>
                    </Col>
                    <Col span={17}>
                        {/* <Input.Group compact>
                            <Input style={{ width: 'calc(100% - 65px)' }} onChange={detectChange} placeholder="Your money" />
                            <Button type="primary" onClick={register}>Enter</Button>
                        </Input.Group> */}
                        <Input type="number" value={self_income} onChange={detectIncomeChange} placeholder="Your money" />
                    </Col>
                </Row>
                <Row>
                    <Col span={4} css={css`display:flex;align-items:center;`}>
                        <label htmlFor="total">Total:  </label>
                    </Col>
                    <Col span={17}>
                        <Input type="number" placeholder="Family money" value={your_total_income} />
                    </Col>
                    {/* <Col span={3} className="regProcess">
                        <Tooltip placement="top" title="Your informations are not registered">
                            <WarningOutlined style={{ display: isRegistered ? 'none' : 'block' }} className='warning' />
                        </Tooltip>
                        <Tooltip placement="top" title="Your informations are succesfully registered">
                            <CheckCircleOutlined style={{ display: isRegistered ? 'block' : 'none' }} className="checkIcon" />
                        </Tooltip>
                    </Col> */}
                </Row>
            </div>
        </StyledNodeDiv>
    );
}

export default StyledNode;