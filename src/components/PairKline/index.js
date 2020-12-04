import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import LocalLoader from "../LocalLoader";
import { useHomeRateData } from "../../contexts/PairData";
import { toK, toNiceDate } from "../../utils";
import { darken } from "polished";
import dayjs from "dayjs";

const ChartWrapper = styled.div`
  height: 100%;
  max-height: 8rem;

  @media screen and (max-width: 600px) {
    min-height: 200px;
  }
`

const CHART_VIEW = {
    RATE0: 'Rate 0',
    RATE1: 'Rate 1'
}
export default function PairKline({address}) {
    const textColor = 'white'
    const [chartFilter] = useState(CHART_VIEW.RATE0)
    const [lineColor, setLineColor] = useState('green')
    const hourlyData = useHomeRateData(address)
    const hourlyRate0 = hourlyData && hourlyData[0]
    const hourlyRate1 = hourlyData && hourlyData[1]
    let utcStartTime = dayjs.utc().subtract(1, 'day').endOf('minute').unix()
    const domain = [dataMin => (dataMin > utcStartTime ? dataMin : utcStartTime), 'dataMax']
    useEffect(()=> {
        if (hourlyRate0 && hourlyRate0.length > 0) {
            const res = hourlyRate0[hourlyRate0.length-1].close - hourlyRate0[0].close
            setLineColor(res < 0 ? 'red' : 'green')
        }
    },[hourlyRate0])
    // const domain = ['dataMin', 'dataMax']
    // const formattedSymbol0 =
    //     pairData?.token0?.symbol.length > 6 ? pairData?.token0?.symbol.slice(0, 5) + '...' : pairData?.token0?.symbol
    // const formattedSymbol1 =
    //     pairData?.token1?.symbol.length > 6 ? pairData?.token1?.symbol.slice(0, 5) + '...' : pairData?.token1?.symbol
    // function valueFormatter(val) {
    //     if (chartFilter === CHART_VIEW.RATE0) {
    //         return (
    //             formattedNum(val) +
    //             `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol1}/${formattedSymbol0}<span>`
    //         )
    //     }
    //     if (chartFilter === CHART_VIEW.RATE1) {
    //         return (
    //             formattedNum(val) +
    //             `<span style="font-size: 12px; margin-left: 4px;">${formattedSymbol0}/${formattedSymbol1}<span>`
    //         )
    //     }
    // }
    return (
        <ChartWrapper>
            {chartFilter === CHART_VIEW.RATE1 &&
            (hourlyRate1 ? (
                <ResponsiveContainer>
                    <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={hourlyRate1}>
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
                            tickFormatter={tick => toK(tick)}
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
                            name={'Close'}
                            yAxisId={0}
                            stroke={darken(0.12, lineColor)}
                            fill="url(#colorUv)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <LocalLoader />
            ))}
            {
                chartFilter === CHART_VIEW.RATE0 &&
            (hourlyRate0 ? (
                <ResponsiveContainer>
                    <AreaChart margin={{ top: 0, right: 10, bottom: 6, left: 0 }} barCategoryGap={1} data={hourlyRate0}>
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
                            tickFormatter={tick => toK(tick)}
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
                            name={'close'}
                            yAxisId={0}
                            stroke={darken(0.12, lineColor)}
                            fill="url(#colorUv)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <LocalLoader />
            ))}

        </ChartWrapper>
    )
}
