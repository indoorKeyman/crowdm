import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    overflow-x: hidden; /* 가로 스크롤 숨기기 */
  }
`;

const DashBackground = (props) => {
  return (
    <>
      <GlobalStyle />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 0.7,
          marginTop:'3%',
        }}
      >
        {/* 헤더 부분 */}
        <Container
          sx={{
              backgroundColor: 'transparent',
              margin: 0, maxWidth: '1152px',
              padding: "32px", paddingTop: "16px", paddingBottom: "10px"}}>
          <h1 style={{margin: "0px" }}>{props.name}</h1>
        </Container>
        {/* 내용 부분 */}
        <Container
          style={{
              backgroundColor: 'transparent',
              minHeight: '65vh',
              // padding: 0,
              // margin: 0,
              maxWidth: '1200px',
          }}
        >
          {props.contents}
        </Container>
      </Box>
    </>
  )
}
  
  export default DashBackground