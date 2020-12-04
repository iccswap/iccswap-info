import React from 'react'
import styled from 'styled-components'
import Title from '../Title'
import { transparentize } from 'polished'
import { withRouter } from 'react-router-dom'

const Wrapper = styled.div`
  height: initial;
  background-color: ${({ theme }) => transparentize(0.4, theme.bg1)};
  color: ${({ theme }) => theme.text1};
  padding: 0.5rem 0.5rem 0.5rem 0.75rem;
  position: sticky;
  top: 0px;
  z-index: 9999;
  box-sizing: border-box;
  /* background-color: #1b1c22; */
  background: linear-gradient(193.68deg, #1b1c22 0.68%, #000000 100.48%);
  color: ${({ theme }) => theme.bg2};
`

const MobileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

function SideNav() {
  return (
    <Wrapper>
      <MobileWrapper>
        <Title />
      </MobileWrapper>
    </Wrapper>
  )
}

export default withRouter(SideNav)
