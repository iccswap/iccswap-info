import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import { RowFixed } from '../Row'
import styled from 'styled-components'
import { ButtonLight, ButtonDark } from '../ButtonStyled'
import Link from '../Link'

import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum, getPoolLink, getSwapLink } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { useColor } from '../../hooks'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${props => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-start;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 740px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr};
    grid-template-areas: ' name liq vol pool ';
  }

  @media screen and (min-width: 1080px) {
    padding: 0 1.125rem;
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.8fr;
    grid-template-areas: ' name liq vol fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1.8fr;
    grid-template-areas: ' name liq vol fees apy';
  }
`

const ListWrapper = styled.div``

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 14px;
  }

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`

const SORT_FIELD = {
  LIQ: 0,
  VOL: 1,
  FEES: 4,
}

const FIELD_TO_VALUE = {
  [SORT_FIELD.LIQ]: 'trackedReserveUSD', // sort with tracked volume only
  [SORT_FIELD.VOL]: 'oneDayVolumeUSD',
  [SORT_FIELD.VOL_7DAYS]: 'oneWeekVolumeUSD',
  [SORT_FIELD.FEES]: 'oneDayVolumeUSD'
}

function PairList({ pairs, color, disbaleLinks, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below900 = useMedia('(max-width: 900px)')
  const below1080 = useMedia('(max-width: 1080px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection] = useState(true)
  const [sortedColumn] = useState(SORT_FIELD.LIQ)
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

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress]

    if (pairData && pairData.token0 && pairData.token1) {
      const liquidity = formattedNum(pairData.reserveUSD, true)
      const volume = formattedNum(pairData.oneDayVolumeUSD, true)
      // const apy = formattedPercent((pairData.oneDayVolumeUSD * 0.003 * 365 * 100) / pairData.reserveUSD)

      return (
        <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
          <DataText area="name" fontWeight="500">
            {!below600 && <div style={{ marginRight: '20px', width: '10px' }}></div>}
            <DoubleTokenLogo
              size={below600 ? 20 : 24}
              a0={pairData.token0.id}
              a1={pairData.token1.id}
              margin={!below740}
            />
            <CustomLink style={{ marginLeft: '20px', whiteSpace: 'nowrap' }} to={'/pair/' + pairAddress} color={color}>
              <FormattedName
                text={pairData.token0.symbol + '-' + pairData.token1.symbol}
                maxCharacters={below600 ? 8 : 16}
                adjustSize={true}
                link={true}
              />
            </CustomLink>
          </DataText>
          <DataText area="vol">{volume}</DataText>
          <DataText area="liq">{liquidity}</DataText>
          {!below1080 && <DataText area="fees">{formattedNum(pairData.oneDayVolumeUSD * 0.003, true)}</DataText>}
          {!below1080 && <RowFixed
            ml={below900 ? '0' : '0'}
            mt={below1080 && '1rem'}
            style={{ flexDirection: below1080 ? 'row-reverse' : 'initial', width: '100%', justifyContent: 'flex-end', paddingRight: '15px' }}
          >

            <Link external href={getPoolLink(pairData.token0?.id, pairData.token1?.id)}>
              <ButtonLight style={{ height: '36px' }} color={backgroundColor}>做市商</ButtonLight>
            </Link>
            <Link external href={getSwapLink(pairData.token0?.id, pairData.token1?.id)}>
              <ButtonDark style={{ height: '36px' }} ml={!below1080 && '.5rem'} mr={below1080 && '.5rem'} color={backgroundColor}>
                兑换
              </ButtonDark>
            </Link>
          </RowFixed>}
        </DashGrid>
      )
    } else {
      return ''
    }
  }

  const pairList =
    pairs &&
    Object.keys(pairs)
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA]
        const pairB = pairs[addressB]
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 = parseFloat(pairA.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairA.reserveUSD)
          const apy1 = parseFloat(pairB.oneDayVolumeUSD * 0.003 * 356 * 100) / parseFloat(pairB.reserveUSD)
          return apy0 > apy1 ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(pairA[FIELD_TO_VALUE[sortedColumn]]) > parseFloat(pairB[FIELD_TO_VALUE[sortedColumn]])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index}>
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        style={{ height: 'fit-content', padding: '20px 1.125rem 1rem 1.125rem', background: '#333534', borderRadius: '4px' }}
      >
        <Flex alignItems="center" justifyContent="flexStart" style={{ width: '55px' }}>
          <ClickableText
            area="name"
            style={{ paddingLeft: '20px' }}
          >
            名称
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="vol"
          >
            交易量（24小时）
          </ClickableText>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            area="liq"
          >
            流动资产
          </ClickableText>
        </Flex>
        {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="fees"
            >
              手续费（24小时）
            </ClickableText>
          </Flex>
        )}
        {!below1080 && (
          <Flex alignItems="center" justifyContent="flex-end" style={{ paddingRight: '15px' }}>
            <ClickableText
              area="apy"
            >
              操作
            </ClickableText>
          </Flex>
        )}
      </DashGrid>
      <Divider />
      <List style={{ paddingTop: '10px' }} p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      <PageButtons>
        <div
          onClick={e => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{page + ' / ' + maxPage}</TYPE.body>
        <div
          onClick={e => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(PairList)
