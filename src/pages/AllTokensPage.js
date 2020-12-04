import React, { useEffect, useState } from 'react'
import 'feather-icons'

import TopTokenList from '../components/TokenList'
import { TYPE, ThemedBackground } from '../Theme'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { PageWrapper, FullWrapper } from '../components'
import { RowBetween } from '../components/Row'
import Search from '../components/Search'
import { useMedia } from 'react-use'
import { transparentize } from 'polished'

function AllTokensPage() {
  const [allTokens, setAllTokens] = useState({})
  const [sub, setSub] = useState(true)
  const result = useAllTokenData()
  useEffect(() => {
    if(Object.keys(result).length > 0 && sub) {
      setAllTokens(result)
      setSub(false)
    }

  }, [result, sub])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below600 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.8, '#389e0f')} />
      <FullWrapper>
        <RowBetween>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Panel style={{ border: 'none', background: 'none', padding: '1.125rem 0 ' }}>
          <TYPE.largeHeader style={{ padding: '0 0 30px 20px' }}>代币</TYPE.largeHeader>
          <TopTokenList tokens={allTokens} itemMax={6} loadMore={true}/>
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllTokensPage
