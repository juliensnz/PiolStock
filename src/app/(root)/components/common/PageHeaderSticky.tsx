import styled from 'styled-components';

const PageHeaderSticky = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  flex-direction: column;
  top: 0;
  background: white;
  margin-bottom: 30px;
  padding-top: 20px;
`;

const PageTop = styled.div`
  display: flex;
  width: 100%;
`;

export {PageHeaderSticky, PageTop};
