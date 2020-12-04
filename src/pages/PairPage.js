import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import 'feather-icons'
import styled from 'styled-components'
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapperLarge } from '../components/index'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import { ButtonLight, ButtonDark } from '../components/ButtonStyled'
import PairChart from '../components/PairChart'
import Link from '../components/Link'
import TxnList from '../components/TxnList'
import Loader from '../components/LocalLoader'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, localNumber } from '../utils'
import { useColor } from '../hooks'
import { usePairData, usePairTransactions } from '../contexts/PairData'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import CopyHelper from '../components/Copy'
import DoubleTokenLogo from '../components/DoubleLogo'
import TokenLogo from '../components/TokenLogo'
import { Hover } from '../components'
import { useEthPrice } from '../contexts/GlobalData'

import FormattedName from '../components/FormattedName'
import TxnType from "../components/TxnType";

const DashboardWrapper = styled.div`
  width: 100%;
  margin-top:2rem;
`

const PanelWrapper = styled.div`
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 12px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
  align-items: start;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
`

const FixedPanel = styled(Panel)`
  width: fit-content;
  padding: 8px 12px;
  border-radius: 10px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const HoverSpan = styled.span`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

function PairPage({ pairAddress, history }) {
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange
  } = usePairData(pairAddress)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])
  const transactions = usePairTransactions(pairAddress)
  const backgroundColor = useColor(pairAddress)
  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  // liquidity
  const liquidity = trackedReserveUSD
    ? formattedNum(trackedReserveUSD, true)
    : reserveUSD
      ? formattedNum(reserveUSD, true)
      : '-'
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // volume	  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUntracked : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
        ? '$0'
        : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked)

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : '-'

  // token data for usd
  const [ethPrice] = useEthPrice()
  const token0USD =
    token0?.derivedETH && ethPrice ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true) : ''

  const token1USD =
    token1?.derivedETH && ethPrice ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true) : ''

  // rates
  const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
  const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

  // formatted symbols for overflow
  const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
  const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol

  const [txFilter, setTxFilter] = useState('All')

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

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

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.85, '#389e0f')} />
      <span />
      <ContentWrapperLarge>
        <RowBetween>
          <Search small={true} />
        </RowBetween>
        <DashboardWrapper>
          <AutoColumn gap="40px" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%' }}>
              <RowFixed style={{ flexWrap: 'wrap', minWidth: '100px' }}>
                <RowFixed>
                  {token0 && token1 && (
                    <DoubleTokenLogo a0={token0?.id || ''} a1={token1?.id || ''} size={40} margin={true} />
                  )}{' '}
                  <TYPE.main fontSize={'1.5rem'} style={{ margin: '0 1rem' }}>
                    {token0 && token1 ? (
                      <>
                        <HoverSpan onClick={() => history.push(`/token/${token0?.id}`)}>{token0.symbol}</HoverSpan>
                        <span>-</span>
                        <HoverSpan onClick={() => history.push(`/token/${token1?.id}`)}>
                          {token1.symbol}
                        </HoverSpan>{' '}
                      </>
                    ) : (
                        ''
                      )}
                  </TYPE.main>
                </RowFixed>
              </RowFixed>
              <RowFixed
                ml={'2.5rem'}
                style={{ flexDirection: 'initial' }}
              >

                <Link external href={getPoolLink(token0?.id, token1?.id)}>
                  <ButtonLight color={backgroundColor}>做市商</ButtonLight>
                </Link>
                <Link external href={getSwapLink(token0?.id, token1?.id)}>
                  <ButtonDark ml={'.5rem'}color={backgroundColor}>
                    兑换
                  </ButtonDark>
                </Link>
              </RowFixed>
            </div>
          </AutoColumn>
          <AutoRow
            gap="6px"
            style={{
              width: 'fit-content',
              marginTop: '0',
              marginBottom: '2rem',
              flexWrap: 'wrap'
            }}
          >
            <FixedPanel onClick={() => history.push(`/token/${token0?.id}`)}>
              <RowFixed>
                <TokenLogo address={token0?.id} size={'16px'} />
                <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'}>
                  {token0 && token1
                    ? `1 ${formattedSymbol0} = ${token0Rate} ${formattedSymbol1} ${parseFloat(token0?.derivedETH) ? '(' + token0USD + ')' : ''
                    }`
                    : '-'}
                </TYPE.main>
              </RowFixed>
            </FixedPanel>
            <FixedPanel onClick={() => history.push(`/token/${token1?.id}`)}>
              <RowFixed>
                <TokenLogo address={token1?.id} size={'16px'} />
                <TYPE.main fontSize={'16px'} lineHeight={1} fontWeight={500} ml={'4px'}>
                  {token0 && token1
                    ? `1 ${formattedSymbol1} = ${token1Rate} ${formattedSymbol0}  ${parseFloat(token1?.derivedETH) ? '(' + token1USD + ')' : ''
                    }`
                    : '-'}
                </TYPE.main>
              </RowFixed>
            </FixedPanel>
          </AutoRow>
          <>
            <PanelWrapper>
              <HeaderBox>
                <HeaderTitle>流动资产</HeaderTitle>
                <RowBetween align="flex-end">
                  <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                    {liquidity}
                  </HeaderValue>
                  <HeaderValue>{liquidityChange}</HeaderValue>
                </RowBetween>
              </HeaderBox>
              <HeaderBox>
                <HeaderTitle>交易量（24小时）</HeaderTitle>
                <RowBetween align="flex-end">
                  <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                    {volume}
                  </HeaderValue>
                  <HeaderValue>{volumeChange}</HeaderValue>
                </RowBetween>
              </HeaderBox>
              <HeaderBox>
                <HeaderTitle>手续费（24小时）</HeaderTitle>
                <RowBetween align="flex-end">
                  <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                    {fees}
                  </HeaderValue>
                  <HeaderValue>{volumeChange}</HeaderValue>
                </RowBetween>
              </HeaderBox>
              <HeaderBox>
                <HeaderTitle>交易次数（24小时）</HeaderTitle>
                <RowBetween align="flex-end">
                  <HeaderValue fontSize={'1.5rem'} lineHeight={1} fontWeight={500}>
                    {oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}
                  </HeaderValue>
                  <HeaderValue>{txnChangeFormatted}</HeaderValue>
                </RowBetween>
              </HeaderBox>
              <HeaderBox style={{ height: '100%' }}>
                <AutoColumn gap="20px">
                  <RowBetween>
                    <HeaderValue>代币量</HeaderValue>
                    <div />
                  </RowBetween>
                  <Hover onClick={() => history.push(`/token/${token0?.id}`)} fade={true}>
                    <AutoRow gap="4px">
                      <TokenLogo address={token0?.id} />
                      <HeaderValue fontSize={20} lineHeight={1} fontWeight={500}>
                        <RowFixed>
                          {reserve0 ? formattedNum(reserve0) : ''}{' '}
                          <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} margin={true} />
                        </RowFixed>
                      </HeaderValue>
                    </AutoRow>
                  </Hover>
                  <Hover onClick={() => history.push(`/token/${token1?.id}`)} fade={true}>
                    <AutoRow gap="4px">
                      <TokenLogo address={token1?.id} />
                      <HeaderValue fontSize={20} lineHeight={1} fontWeight={500}>
                        <RowFixed>
                          {reserve1 ? formattedNum(reserve1) : ''}{' '}
                          <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} margin={true} />
                        </RowFixed>
                      </HeaderValue>
                    </AutoRow>
                  </Hover>
                </AutoColumn>
              </HeaderBox>

              <Panel style={{ gridColumn:'2/25', gridRow:'1/6' }}>
                <PairChart
                  address={pairAddress}
                  color='#F5202C'
                  base0={reserve1 / reserve0}
                  base1={reserve0 / reserve1}
                />
              </Panel>
            </PanelWrapper>
            <TxnType active={txFilter} setActive={setTxFilter}></TxnType>
            <Panel style={{ marginTop: '1.5rem', padding: '0px 0px 20px 0', borderRadius: '4px' }}>
              {transactions ? <TxnList transactions={transactions} type={txFilter} /> : <Loader />}
            </Panel>
            <RowBetween style={{ marginTop: '3rem' }}>
              <TYPE.main fontSize={'1.125rem'}>交易对信息</TYPE.main>{' '}
            </RowBetween>
            <Panel
              rounded
              style={{
                marginTop: '1.5rem', marginBottom: '50px', padding: '0px 0px 20px 0', borderRadius: '4px'
              }}
              p={20}
            >
              <TokenDetailsLayout style={{ display: 'block', boxSizing: 'border-box' }}>
                <Column>
                  <RowBetween style={{ padding: '15px 15px', background: '#323434' }}>
                    <TYPE.main style={{ width: '20%' }}>交易对</TYPE.main>
                    <TYPE.main style={{ width: '20%' }}>地址</TYPE.main>
                    <TYPE.main style={{ width: '20%' }}>
                      <RowFixed>
                        <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} />{' '}
                        <span style={{ marginLeft: '4px' }}>地址</span>
                      </RowFixed>
                    </TYPE.main>
                    <TYPE.main style={{ width: '20%' }}>
                      <RowFixed>
                        <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} />{' '}
                        <span style={{ marginLeft: '4px' }}>地址</span>
                      </RowFixed>
                    </TYPE.main>
                    <TYPE.main style={{ width: '20%', textAlign: 'right', paddingRight: '15px' }}>操作</TYPE.main>
                  </RowBetween>
                  <RowBetween style={{ padding: '0 15px' }}>
                    <TYPE.main style={{ marginTop: '1.2rem', width: '20%' }}>
                      <RowFixed>
                        <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} />-
                      <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} />
                      </RowFixed>
                    </TYPE.main>
                    <AutoRow align="flex-end" style={{ width: '20%' }}>
                      <TYPE.main style={{ marginTop: '.5rem' }}>
                        {pairAddress.slice(0, 6) + '...' + pairAddress.slice(38, 42)}
                      </TYPE.main>
                      <CopyHelper toCopy={pairAddress} />
                    </AutoRow>
                    <AutoRow align="flex-end" style={{ width: '20%' }}>
                      <TYPE.main style={{ marginTop: '.5rem' }}>
                        {token0 && token0.id.slice(0, 6) + '...' + token0.id.slice(38, 42)}
                      </TYPE.main>
                      <CopyHelper toCopy={token0?.id} />
                    </AutoRow>
                    <AutoRow align="flex-end" style={{ width: '20%' }}>
                      <TYPE.main style={{ marginTop: '.5rem' }} fontSize={16}>
                        {token1 && token1.id.slice(0, 6) + '...' + token1.id.slice(38, 42)}
                      </TYPE.main>
                      <CopyHelper toCopy={token1?.id} />
                    </AutoRow>
                    <ButtonLight style={{ background: 'none', width: '20%', textAlign: 'right' }} color={backgroundColor}>
                      <Link color={backgroundColor} external href={'https://etherscan.io/address/' + pairAddress}>
                        Etherscan查看
                      </Link>
                    </ButtonLight>
                  </RowBetween>
                </Column>
              </TokenDetailsLayout>
            </Panel>
          </>
        </DashboardWrapper>
      </ContentWrapperLarge>
    </PageWrapper >
  )
}

export default withRouter(PairPage)
