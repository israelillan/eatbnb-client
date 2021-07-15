import styled, {css} from 'styled-components';

const getTableContainerStyle = ({aspect}) => (
    css`
      width: 800px;
      height: ${800 / aspect}px;
    `
);

export const TablesLayoutContainer = styled.div`
  ${getTableContainerStyle}
`;

export const Table = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;
