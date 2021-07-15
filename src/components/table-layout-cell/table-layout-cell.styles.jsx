import styled, {css} from 'styled-components';

const getCellStyle = ({cols, rows}) => (
    css`
      width: ${100 / cols}%;
      height: ${100 / rows}%;
    `
);

const getOverStyle = ({isOver}) => (
    css`
        background: ${isOver ? '#ffc800' : '#f3f3f3'};
    `
);

export const TableCellContainer = styled.div`
  border: 1px solid #ffffff;
  padding: 3px;
  ${getCellStyle}
  ${getOverStyle}
`;
