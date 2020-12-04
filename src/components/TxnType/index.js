import React from 'react'
import styled from 'styled-components'
import { TYPE } from "../../Theme";
import { RowFixed } from "../Row";

const TXN_TYPE = {
    ALL: 'All',
    SWAP: 'Swaps',
    ADD: 'Adds',
    REMOVE: 'Removes'
}

const SortText = styled.button`
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  margin-right: 0.75rem !important;
  border: none;
  border-bottom: 1px solid ${({ active, theme }) => (active ? theme.bg8 : 'none')};
  background-color: transparent;
  font-size: 1rem;
  padding: 0;
  color: ${({ active, theme }) => (active ? theme.bg8 : theme.text6)};
  outline: none;
`
const TxnType = ({ active, setActive })=> {
    return (
        <div style={{paddingLeft:'20px'}}>
            <TYPE.main fontSize={'1.125rem'} style={{ margin: '1rem 0' }}>交易
            </TYPE.main>{' '}
            <RowFixed area="txn" gap="10px" pl={4} style={{ paddingBottom: '20px' }}>
                <SortText onClick={() => { setActive(TXN_TYPE.ALL) }} active={active === TXN_TYPE.ALL}>所有</SortText>
                <SortText onClick={() => { setActive(TXN_TYPE.SWAP) }} active={active === TXN_TYPE.SWAP}>兑换</SortText>
                <SortText onClick={() => { setActive(TXN_TYPE.ADD) }} active={active === TXN_TYPE.ADD}>添加</SortText>
                <SortText onClick={() => { setActive(TXN_TYPE.REMOVE) }} active={active === TXN_TYPE.REMOVE}>提取</SortText>
            </RowFixed>
        </div>
    )
}


export default TxnType
