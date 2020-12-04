import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Link from "../Link";
import Logo from '../../assets/logo.png'

const IconWrapper = styled.div`
  height: 2.86rem;
  line-height: 3.2rem;
  margin: 0 1.14rem;
  font-size: 1.7rem;
  font-family: BrandoCondensedBold;
  color: ${({ theme }) => theme.white};
  &:hover {
    cursor: pointer;
  }

  z-index: 10;
`
const TitleBox = styled.div`
   color: ${({ theme }) => theme.white};
   width: 100%;
   display: flex;
   align-items: center;
   justify-content: flex-between;
`
const TitleWrapper = styled.div`
  height: 2.86rem;
  line-height: 2.86rem;
  margin-left: 1.14rem;
  font-size: 1rem;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: justify;
  &:hover {
    cursor: pointer;
  }

  z-index: 10;
`
const LeftTitle = styled.span`
    width: 100%;
    display: flex;
   justify-content: flex-start;
   color: ${({ theme }) => theme.white};
  &:hover {
    cursor: pointer;
  }
`
const RightTitle = styled.div`
    width: 100px;
    font-family: BrandoCondensedBold;
    color: ${({ theme }) => theme.white};
    text-align: center;
    padding: 10px;
    margin-right: 20px
    border-radius: 6px;
    background-color: rgba(255, 255, 255, 0.2);
  &:hover {
    cursor: pointer;
  }
`

export default function Title() {
  const history = useHistory()

  return (
      <TitleBox>
          <LeftTitle>
              <IconWrapper onClick={() => history.push('/')}>
                  <img width={ '100px' } src={Logo} alt="logo" />
              </IconWrapper>
              <TitleWrapper onClick={() => history.push('/')}>首页</TitleWrapper>
              <TitleWrapper><Link href="https://app.iccswap.com/#/swap" style={{color: '#fff'}}>兑换</Link></TitleWrapper>
              <TitleWrapper><Link href="https://app.iccswap.com/#/pool" style={{color: '#fff'}}>做市商</Link></TitleWrapper>
          </LeftTitle>
          <RightTitle><Link href="https://app.iccswap.com/#/swap" style={{color: '#fff'}}>接入钱包</Link></RightTitle>
      </TitleBox>
  )
}
