import styled, {css} from 'styled-components';

export const TablesLayoutEditorContainer = styled.div`
`;

const getTableContainerStyle = ({aspect}) => (
    css`
      width: 800px;
      height: ${800 / aspect}px;
    `
);

export const TableContainer = styled.div`
  ${getTableContainerStyle}
`;

export const Table = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`;
