import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import TxnType from '../components/TxnType'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

import { useGlobalTransactions } from '../contexts/GlobalData'
import { useAllPairData } from '../contexts/PairData'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { CustomLink } from '../components/Link'

import { PageWrapper, ContentWrapper } from '../components'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 1160px;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
  padding: 0 20px;
`
function GlobalPage() {
  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const transactions = useGlobalTransactions()
  const [txFilter, setTxFilter] = useState('All')
  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0
    })
  }, [])

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.9, '#389e0f')} />
      <ContentWrapper>
        <div>
          <AutoColumn gap="24px" style={{ padding: '0 20px 24px' }}>
            <Search />
            <GlobalStats />
          </AutoColumn>
          <GridRow>
            <Panel style={{ height: '100%', minHeight: '300px' }}>
              <GlobalChart display="liquidity" />
            </Panel>
            <Panel style={{ height: '100%' }}>
              <GlobalChart display="volume" />
            </Panel>
          </GridRow>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main style={{paddingLeft: '20px'}} fontSize={'1rem'}>交易对</TYPE.main>
              <CustomLink to={'/pairs'}>查看更多</CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ', border: 'none', boxShadow: 'none', background: 'none' }}>
            <PairList pairs={allPairs} maxItems={6} loadMore={false}/>
          </Panel>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main style={{paddingLeft: '20px'}} fontSize={'1.125rem'}>代币</TYPE.main>
              <CustomLink to={'/tokens'}>查看更多</CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ', border: 'none', boxShadow: 'none', background: 'none' }}>
            <TopTokenList tokens={allTokens} itemMax={6} loadMore={false}/>
          </Panel>
          <TxnType active={txFilter} setActive={setTxFilter}></TxnType>
          <Panel style={{ margin: '1rem auto', padding: '0px 0px 20px', borderRadius: '4px', width: '1160px' }}>
            <TxnList transactions={transactions} type={txFilter} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
