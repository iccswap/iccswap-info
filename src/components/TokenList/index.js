import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import Link from '../../components/Link'

import { Box, Flex, Text } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink, } from '../Link'
import Row from '../Row'
import RowBetween from '../../components/Row'
import RowAround from '../../components/Row'
import Panel from '../../components/Panel'
import KlineWrapper from '../../components/TokenKline'
import { useColor } from '../../hooks'
import { ButtonLight, ButtonDark } from '../../components/ButtonStyled'
// import { Divider } from '..'

import { formattedNum, formattedPercent, getPoolLink, getSwapLink } from '../../utils'
import { withRouter } from 'react-router-dom'
import { OVERVIEW_TOKEN_BLACKLIST } from '../../constants'
import FormattedName from '../FormattedName'
import LocalLoader from "../LocalLoader";

dayjs.extend(utc)


const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
  display: ${({ hide = false }) => hide && 'none'};
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
  text-align: start;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text1};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
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


// @TODO rework into virtualized list
function TopTokenList({ tokens, loadMore, itemMax = 10 }) {

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [dataList, setDataList] = useState([])
  const backgroundColor = useColor()

  useEffect(() => {
    if (page === 1) {
      setMaxPage(1) // edit this to do modular
      setPage(1)
    }
  }, [tokens, page])

  const formattedTokens = useMemo(() => {
    return (
      tokens &&
      Object.keys(tokens)
        .filter(key => {
          return !OVERVIEW_TOKEN_BLACKLIST.includes(key)
        })
        .map(key => tokens[key])
    )
  }, [tokens])
  useEffect(() => {
    if (tokens && formattedTokens) {
      let extraPages = 1
      if (formattedTokens.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages)
    }
  }, [itemMax, tokens, formattedTokens])

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort((a, b) => {
          return parseFloat(a['totalLiquidityUSD']) > parseFloat(b['totalLiquidityUSD']) ? -1 : 1
        })
    )
  }, [formattedTokens])

  const ListItem = ({ item, index }) => {
    return (
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <CustomLink to={'/token/' + item.id}>
          <Panel width="360px" height="420px" style={{ justifyContent: 'flex-start' }}>
            <DataText area="name" fontWeight="500">
              <Row style={{ justifyContent: 'center', marginBottom: '30px' }}>
                <TokenLogo address={item.id} />
                <FormattedName
                  text={item.name}
                  maxCharacters={16}
                  adjustSize={true}
                  link={true}
                />
              </Row>
            </DataText>
            <KlineWrapper address={item.id} color={ item.priceChangeUSD < 0 ? 'red' : 'green'}></KlineWrapper>
            <RowBetween style={{ marginTop: '20px' }}>
              <DashGrid center={true} style={{ height: 'fit-content' }}>
                <Flex alignItems="center">
                  <ClickableText
                    area="price">最新价
              </ClickableText>
                </Flex>
                <Flex alignItems="center">
                  <ClickableText
                    area="liq">流动资产
          </ClickableText>
                </Flex>
                <Flex alignItems="center">
                  <ClickableText
                    area="vol">24H交易量
          </ClickableText>
                </Flex>
              </DashGrid>
              <DashGrid style={{ height: 'fit-content', flex: '1' }} focus={true}>
                <Row style={{ justifyContent: 'flex-end' }}>
                  <DataText style={{ justifyContent: 'flex-end', marginRight: '5px' }} area="price" color="text" fontWeight="500">
                    {formattedNum(item.priceUSD, true)}
                  </DataText>
                  <DataText area="change">{formattedPercent(item.priceChangeUSD)}</DataText>
                </Row>
                <DataText style={{ justifyContent: 'flex-end' }} area="liq">{formattedNum(item.totalLiquidityUSD, true)}</DataText>
                <DataText style={{ justifyContent: 'flex-end' }} area="vol">{formattedNum(item.oneDayVolumeUSD, true)}</DataText>
              </DashGrid>
            </RowBetween>
          </Panel>
        </CustomLink>
        <span style={{ position: 'absolute', bottom: '30px', left: '42px', width: '280px' }}>
          <RowAround style={{ justifyContent: 'space-around' }}>
            <Link href={getPoolLink(item.id)}>
              <ButtonLight color={backgroundColor}>做市商</ButtonLight>
            </Link>
            <Link href={getSwapLink(item.id)}>
              <ButtonDark color={backgroundColor}>
                兑换
                    </ButtonDark>
            </Link>
          </RowAround>
        </span>
      </span>
    )
  }
  // 加载更多
  useEffect(() => {
    const tokenList =
      filteredList &&
      filteredList.slice(itemMax * (page - 1), page * itemMax)
        .map((item, index) => {
          return (
            <div style={{ margin: '0px 20px 25px 20px' }} key={(page - 1) * itemMax + index + 1}>
              <ListItem key={(page - 1) * itemMax + index + 1} item={item} />
            </div>
          )
        })

    if (page === 1) {
      setDataList(tokenList)
    } else {
      setDataList(L => {
        return [...L, ...tokenList]
      })
    }
  }, [itemMax, filteredList, page])


  return (
    <ListWrapper>
      <List p={0} style={{ flex: '1', flexWrap: 'wrap' }}>{dataList.length === 0 ? <LocalLoader /> : dataList}</List>
      {dataList.length === 0 ? '' : (
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

export default withRouter(TopTokenList)
