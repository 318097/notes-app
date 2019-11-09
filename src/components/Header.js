import React from 'react'
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Spin, Icon } from 'antd';

import AddNote from './AddNote';

const antIcon = <Icon type="loading" spin />;

const Container = styled.header`
  display: flex;
  // background: #fff;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px;
  h3{
    flex: 1 1 70%;
    margin: 0;
    margin-left: 10px;
    text-transform: capatilize;
    font-weight: bold;
    vertical-align: center;
  }
`

const Header = ({ appLoading }) => {
  return (
    <Container>
      <h3>
        Notes{' '}{appLoading && <Spin indicator={antIcon} />}
      </h3>
      <AddNote />
    </Container>
  )
};

const mapStateToProps = state => ({ appLoading: state.appLoading });

export default connect(mapStateToProps)(Header);
