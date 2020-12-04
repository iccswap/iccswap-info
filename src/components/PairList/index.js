import React, { useState, useEffect } from 'react'
// import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import RowBetween from '../../components/Row'
import KlineWrapper from '../PairKline'
import { ButtonLight, ButtonDark } from '../../components/ButtonStyled'
import RowAround from '../../components/Row'
import Link from '../../components/Link'
import { useColor } from '../../hooks'

import { CustomLink } from '../Link'
// import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum, getPoolLink, getSwapLink } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
// import QuestionHelper from '../QuestionHelper'
// import { TYPE } from '../../Theme'
import Panel from '../Panel'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
  display:flex;
  justify-content:flex-start;
  width: 1200px;
`

const DashGrid = styled.div`
  display: flex;
  flex-direction:column;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';

  > * {
    justify-content: flex-start;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      flex:1;
    }
  }

  @media screen and (min-width: 680px) {
    display: flex;
    flex-direction:column;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol ';

    > * {
      justify-content: flex-start;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: flex;
    flex-direction:column;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price change';
  }
`

const ListWrapper = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: start;
  user-select: none;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 12px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

function PairList({ pairs, color, disbaleLinks, loadMore, maxItems = 10 }) {
  // pagination
  const ITEMS_PER_PAGE = maxItems
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [dataList, setDataList] = useState([])
  // sorting
  const backgroundColor = useColor()
  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])


  const ListItem = ({ pairAddress }) => {
    const pairData = pairs[pairAddress]
    if (pairData && pairData.token0 && pairData.token1) {
      const { token0, token1, reserve0, reserve1, reserveUSD, oneDayVolumeUSD } = pairData
      const liquidity = formattedNum(reserveUSD, true)
      const volume = formattedNum(oneDayVolumeUSD, true)

      // rates
      // const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
      const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

      // formatted symbols for overflow
      const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
      const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol
      // const apy = formattedPercent((pairData.oneDayVolumeUSD * 0.003 * 365 * 100) / pairData.reserveUSD)

      return (
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <CustomLink to={'/pair/' + pairAddress} color={color}>
            <Panel width="360px" height="420px" style={{ justifyContent: 'flex-start' }}>
              <DataText area="name" fontWeight="500" style={{ justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ marginRight: '20px', width: '10px' }}></div>
                <DoubleTokenLogo
                  size={38}
                  a0={pairData.token0.id}
                  a1={pairData.token1.id}
                  margin={true}
                />
                <FormattedName
                  text={pairData.token0.symbol + '-' + pairData.token1.symbol}
                  maxCharacters={16}
                  adjustSize={true}
                  link={true}
                />
              </DataText>
              <KlineWrapper address={pairAddress}></KlineWrapper>
              <RowBetween style={{ marginTop: '20px' }}>
                <DashGrid
                  center={true}
                  disbaleLinks={disbaleLinks}
                  style={{ height: 'fit-content' }}
                >
                  <Flex alignItems="center">
                    <ClickableText area="price">价格</ClickableText>
                  </Flex>
                  <Flex alignItems="center" justifyContent="flex-start">
                    <ClickableText area="liq">流动资产</ClickableText>
                  </Flex>
                  <Flex alignItems="center">
                    <ClickableText area="vol">24H交易量</ClickableText>
                  </Flex>
                </DashGrid>
                <DashGrid style={{ height: 'fit-content', flex: '1' }} disbaleLinks={disbaleLinks} focus={true}>
                  <DataText area="price" style={{ justifyContent: 'flex-end' }}>{token1Rate} {formattedSymbol0}/{formattedSymbol1}</DataText>
                  <DataText area="liq" style={{ justifyContent: 'flex-end' }}>{liquidity}</DataText>
                  <DataText area="vol" style={{ justifyContent: 'flex-end' }}>{volume}</DataText>
                </DashGrid>
              </RowBetween>
            </Panel>
          </CustomLink>
          <span style={{ position: 'absolute', bottom: '30px', left: '42px', width: '280px' }}>
            <RowAround style={{ justifyContent: 'space-around' }}>
              <Link href={getPoolLink(pairData.token0?.id, pairData.token1?.id)}>
                <ButtonLight color={backgroundColor}>做市商</ButtonLight>
              </Link>
              <Link href={getSwapLink(pairData.token0?.id, pairData.token1?.id)}>
                <ButtonDark color={backgroundColor}>
                  兑换
                    </ButtonDark>
              </Link>
            </RowAround>
          </span>
        </span>
      )
    } else {
      return ''
    }
  }
  // 加载更多时 传参 参考m端滚动加载
  useEffect(() => {
    const pairList =
      pairs &&
      Object.keys(pairs)
          .sort((addressA, addressB) => {
            const pairA = pairs[addressA]
            const pairB = pairs[addressB]
            return parseFloat(pairA['trackedReserveUSD']) > parseFloat(pairB['trackedReserveUSD']) ? -1: 1
          }).slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
        .map((pairAddress, index) => {
          return (
            <div style={{ margin: '0px 20px 25px 20px' }} key={(page - 1) * ITEMS_PER_PAGE + index + 1}>
              <ListItem key={(page - 1) * ITEMS_PER_PAGE + index + 1} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
            </div>
          )
        })
    if (page === 1) {
      setDataList(pairList)
    } else {
      setDataList(L => {
        return [...L, ...pairList]
      })
    }
  }, [ITEMS_PER_PAGE, pairs, page])

  return (
    <ListWrapper>
      <List style={{ flex: '1', flexWrap: 'wrap' }} p={0}>{dataList.length === 0 ? <LocalLoader /> : dataList}</List>
      {dataList.length === 0 ? <LocalLoader /> : (
        <PageButtons>
          <div
            style={{ cursor: 'pointer', color: '#587FF8' }}
            onClick={e => {
              setPage(page === maxPage ? page : page + 1)
            }}
          >
            {page && page === maxPage ? '' : (loadMore ? '加载更多' : '')}
          </div>
        </PageButtons>
      )}
    </ListWrapper>
  )
}

export default withRouter(PairList)
