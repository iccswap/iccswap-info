import React from 'react'
import styled from 'styled-components'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { toK, toNiceDate } from "../../utils";
import { darken } from "polished";
import { useTokenPriceData } from "../../contexts/TokenData";
import dayjs from "dayjs";

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 8rem;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

export default function TokenKline({address, color}) {
    // 1天小时线
    const hourlyDay = useTokenPriceData(address, '1 day', 3600)
    let utcStartTime = dayjs.utc().subtract(1, 'day').startOf('minute').unix()
    const textColor = 'white'
    const domain = [dataMin => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax']
  return (
      <ChartWrapper>
          <ResponsiveContainer>
              <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={hourlyDay}>
                  <XAxis
                      tickLine={false}
                      axisLine={false}
                      interval="preserveEnd"
                      tickMargin={16}
                      minTickGap={120}
                      tickFormatter={tick => toNiceDate(tick)}
                      dataKey="timestamp"
                      tick={{ fill: textColor }}
                      type={'number'}
                      domain={domain}
                  />
                  <YAxis
                      type="number"
                      orientation="right"
                      tickFormatter={tick => '$' + toK(tick)}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveEnd"
                      minTickGap={80}
                      yAxisId={0}
                      tick={{ fill: textColor }}
                  />
                  <Area
                      key={'other'}
                      dataKey={'close'}
                      stackId="2"
                      strokeWidth={2}
                      dot={false}
                      type="monotone"
                      name={'open'}
                      yAxisId={0}
                      stroke={darken(0.12, color)}
                      fill="url(#colorUv)"
                  />
              </AreaChart>
          </ResponsiveContainer>
      </ChartWrapper>
  )
}

