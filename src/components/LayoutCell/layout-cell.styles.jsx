import styled, {css} from 'styled-components';

const tablePresentStyle = css`
  background: #5858e5;
`

const getStyle = props => {
    if(props.table) {
        return tablePresentStyle;
    }
    return null;
};

export const LayoutCellContainer = styled.div`
  border: 1px solid #999999;
  display: table-cell;
  padding: 3px 10px;
  
  ${getStyle}
`;