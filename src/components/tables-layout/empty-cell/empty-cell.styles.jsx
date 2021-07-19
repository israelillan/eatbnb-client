import styled, {css} from 'styled-components';

const getOverStyle = ({isOver}) => (
    css`
      background-color: ${isOver ? '#ffc800' : '#f3f3f3'};
    `
);
const getCursorStyle = ({onClick}) => (
    css`
      cursor: ${onClick ? 'pointer' : 'default'};
    `
);

export const TablesLayoutCellContainer = styled.div`
  border: 1px black;
  width: 100%;
  height: 100%;
  min-height: 60px;
  ${getOverStyle}
  ${getCursorStyle}
`;
