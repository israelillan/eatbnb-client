import styled, {css} from 'styled-components';

const getDragStyle = ({isDragging, allowDragging}) => (
    css`
      opacity: ${isDragging ? 0.5 : 1};
      cursor: ${allowDragging ? 'move' : 'pointer'};
    `
)

export const TablesLayoutTableContainer = styled.div`
  background: #4343b8;
  width: 100%;
  height: 100%;
  color: #ffffff;
  ${getDragStyle}
`;

export const ReferenceContainer = styled.div`
  width: 100%;
  height: 50%;
`;

export const SeatsContainer = styled.div`
  width: 100%;
  height: 50%;
  text-align: right;
`;