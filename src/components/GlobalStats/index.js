import React from 'react'
import styled from 'styled-components'
import { RowBetween } from '../Row'
import { useGlobalData } from '../../contexts/GlobalData'
import { formattedNum, formattedPercent, localNumber } from '../../utils'

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
`
const HeaderBox = styled.div`
  width: 260px;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  color: ${({ theme }) => theme.white};
`
const HeaderTitle = styled.div`
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  margin-bottom: 10px;
`
const HeaderValue = styled.div`
  font-size: 18px;
  font-family: Montserrat, Montserrat-SemiBold;
  font-weight: SemiBold;
`
const Medium = styled.span`
  font-size: 14px;
`
export default function GlobalStats() {
    const { oneDayVolumeUSD, oneDayTxns, txnChange, volumeChangeUSD, liquidityChangeUSD, totalLiquidityUSD } = useGlobalData()
    const oneDayFees = oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD * 0.003, true) : '$0'
    return (
        <Header>
            <HeaderBox>
                <HeaderTitle>流动资产</HeaderTitle>
                <RowBetween>
                    <HeaderValue>${localNumber(totalLiquidityUSD)}</HeaderValue>
                    <HeaderValue><Medium>{formattedPercent(liquidityChangeUSD)}</Medium></HeaderValue>
                </RowBetween>
            </HeaderBox>
            <HeaderBox>
                <HeaderTitle>交易量(24小时)</HeaderTitle>
                <RowBetween>
                    <HeaderValue>${localNumber(oneDayVolumeUSD)}</HeaderValue>
                    <HeaderValue><Medium>{formattedPercent(volumeChangeUSD)}</Medium></HeaderValue>
                </RowBetween>
            </HeaderBox>
            <HeaderBox>
                <HeaderTitle>手续费(24小时)</HeaderTitle>
                <RowBetween>
                    <HeaderValue>{oneDayFees}</HeaderValue>
                    <HeaderValue><Medium>{formattedPercent(volumeChangeUSD)}</Medium></HeaderValue>
                </RowBetween>
            </HeaderBox>
            <HeaderBox>
                <HeaderTitle>交易次数(24小时)</HeaderTitle>
                <RowBetween>
                    <HeaderValue>{localNumber(oneDayTxns)}</HeaderValue>
                    <HeaderValue><Medium>{formattedPercent(txnChange)}</Medium></HeaderValue>
                </RowBetween>
            </HeaderBox>
        </Header>
    )
}
