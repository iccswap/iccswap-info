import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import Link from '../components/Link'
import Panel from '../components/Panel'
import TokenLogo from '../components/TokenLogo'
import PairLi from '../components/PairLi'
import Loader from '../components/LocalLoader'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { ButtonLight, ButtonDark } from '../components/ButtonStyled'
import TxnList from '../components/TxnList'
import TokenChart from '../components/TokenChart'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, localNumber } from '../utils'
import { useTokenData, useTokenTransactions, useTokenPairs } from '../contexts/TokenData'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { useColor } from '../hooks'
import CopyHelper from '../components/Copy'
import { useDataForList } from '../contexts/PairData'
import { useEffect } from 'react'
import { PageWrapper, ContentWrapper } from '../components'
import FormattedName from '../components/FormattedName'
import TxnType from "../components/TxnType";

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 12px;
  display: inline-grid;
  width: 100%;
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto 1fr;
  column-gap: 30px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`


const HeaderBox = styled.div`
  width: 260px;
  padding: 10px 15px;
  box-sizing: border-box;
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
function TokenPage({ address }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange
  } = useTokenData(address)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const allPairs = useTokenPairs(address)

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs)

  // all transactions with this token
  const transactions = useTokenTransactions(address)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
        ? '$0'
        : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT)

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-'
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  // format for long symbol
  const LENGTH = 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [txFilter, setTxFilter] = useState('All')

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.85, '#389e0f')} />

      <ContentWrapper>
        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
          <Search small={true} />
        </RowBetween>

        <DashboardWrapper style={{ marginTop: '2rem' }}>
          <RowBetween style={{ flexWrap: 'wrap', marginBottom: '2rem', alignItems: 'flex-start' }}>
            <RowFixed style={{ flexWrap: 'wrap' }}>
              <RowFixed>
                <TokenLogo address={address} size="40px" style={{ alignSelf: 'center' }} />
                <TYPE.main fontSize={ '1.5rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                  <RowFixed gap="6px">
                    <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                    {formattedSymbol ? `(${formattedSymbol})` : ''}
                  </RowFixed>
                </TYPE.main>{' '}
                <TYPE.main fontSize={'1.5rem'} fontWeight={500} style={{ marginRight: '1rem' }}>
                  {price}
                </TYPE.main>
                {priceChange}
              </RowFixed>
            </RowFixed>
            <span>
              <RowFixed ml={ '2.5rem' } mt={ '0' }>
                <Link href={getPoolLink(address)}>
                  <ButtonLight color={backgroundColor}>做市商</ButtonLight>
                </Link>
                <Link href={getSwapLink(address)}>
                  <ButtonDark ml={'.5rem'} color={backgroundColor}>
                    兑换
                  </ButtonDark>
                </Link>
              </RowFixed>
            </span>
          </RowBetween>
          <>
            <PanelWrapper style={{ marginTop: '1rem' }}>
              <HeaderBox>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <HeaderTitle>流动资产</HeaderTitle>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {liquidity}
                    </HeaderValue>
                    <HeaderValue>{liquidityChange}</HeaderValue>
                  </RowBetween>
                </AutoColumn>
              </HeaderBox>
              <HeaderBox>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <HeaderTitle>交易量（24小时）</HeaderTitle>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {volume}
                    </HeaderValue>
                    <HeaderValue>{volumeChange}</HeaderValue>
                  </RowBetween>
                </AutoColumn>
              </HeaderBox>

              <HeaderBox>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <HeaderTitle>交易次数（24小时）</HeaderTitle>
                    <div />
                  </RowBetween>
                  <RowBetween align="flex-end">
                    <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                      {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                    </HeaderValue>
                    <HeaderValue>{txnChangeFormatted}</HeaderValue>
                  </RowBetween>
                </AutoColumn>
              </HeaderBox>
              <Panel style={{ gridColumn: '2/20', gridRow: '1/5' }}>
                <TokenChart address={address} color='#F5202C' base={priceUSD} />
              </Panel>
            </PanelWrapper>
          </>

          <span>
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
              交易对
            </TYPE.main>
          </span>

          <Panel
            rounded
            style={{
              marginTop: '1.5rem',
              padding: '0',
              borderRadius: '4px'
            }}
          >
            {address && fetchedPairsList ? (
              <PairLi color={backgroundColor} address={address} pairs={fetchedPairsList} />
            ) : (
                <Loader />
              )}
          </Panel>
          <TxnType active={txFilter} setActive={setTxFilter}></TxnType>
          <Panel style={{ padding: '0', borderRadius: '4px' }} rounded>
            {transactions ? <TxnList color={backgroundColor} transactions={transactions}  type={txFilter}/> : <Loader />}
          </Panel>
          <>
            <RowBetween style={{ marginTop: '3rem' }}>
              <TYPE.main fontSize={'1.125rem'}>代币信息</TYPE.main>{' '}
            </RowBetween>
            <Panel
              rounded
              style={{
                marginTop: '1.5rem', marginBottom: '50px', padding: '0px 0px 20px 0', borderRadius: '4px'
              }}
              p={20}
            >
              <TokenDetailsLayout style={{ display: 'block' }}>
                <Column>
                  <RowBetween style={{ padding: '15px 15px', background: '#323434' }}>
                    <TYPE.main style={{ width: '25%' }}>代币</TYPE.main>
                    <TYPE.main style={{ width: '25%' }}>代币全称</TYPE.main>
                    <TYPE.main style={{ width: '25%' }}>地址</TYPE.main>
                    <TYPE.main style={{ width: '25%', textAlign: 'right', paddingRight: '15px' }}>操作</TYPE.main>
                  </RowBetween>
                  <RowBetween style={{ padding: '0 15px' }}>
                    <Text style={{ marginTop: '.5rem', width: '25%' }} fontSize={14} fontWeight="500">
                      <FormattedName text={symbol} maxCharacters={12} />
                    </Text>
                    <TYPE.main style={{ marginTop: '.5rem', width: '25%' }} fontSize={14} fontWeight="500">
                      <FormattedName text={name} maxCharacters={16} />
                    </TYPE.main>
                    <AutoRow align="flex-end" style={{ width: '25%' }}>
                      <TYPE.main style={{ marginTop: '.5rem' }} fontSize={14} fontWeight="500">
                        {address.slice(0, 8) + '...' + address.slice(36, 42)}
                      </TYPE.main>
                      <CopyHelper toCopy={address} />
                    </AutoRow>
                    <ButtonLight style={{ width: '25%', background: 'none', textAlign: 'right' }} color={backgroundColor}>
                      <Link color={backgroundColor} external href={'https://etherscan.io/address/' + address}>
                        Etherscan查看
                  </Link>
                    </ButtonLight>
                  </RowBetween>
                </Column>
              </TokenDetailsLayout>
            </Panel>
          </>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(TokenPage)
