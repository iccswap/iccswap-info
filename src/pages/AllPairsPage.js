import React, { useEffect } from 'react'
import 'feather-icons'

import { TYPE, ThemedBackground } from '../Theme'
import Panel from '../components/Panel'
import { useAllPairData } from '../contexts/PairData'
import PairList from '../components/PairList'
import { PageWrapper, FullWrapper } from '../components'
import { RowBetween } from '../components/Row'
import Search from '../components/Search'
import { useMedia } from 'react-use'
import { transparentize } from 'polished'

function AllPairsPage() {
  const allPairs = useAllPairData()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const below800 = useMedia('(max-width: 800px)')

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.8, '#389e0f')} />
      <FullWrapper>
        <RowBetween>
          {!below800 && <Search small={true} />}
        </RowBetween>
        <Panel style={{ padding: '1.125rem 0 ', border: 'none', background: 'none' }}>
          <TYPE.largeHeader style={{ padding: '0 0 30px 20px' }}>交易对</TYPE.largeHeader>
          <PairList pairs={allPairs} disbaleLinks={true} maxItems={6} loadMore={true} />
        </Panel>
      </FullWrapper>
    </PageWrapper>
  )
}

export default AllPairsPage
