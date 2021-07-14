import React from 'react';
import {LayoutCellContainer} from "./layout-cell.styles";

const LayoutCell = ({x, y, table, onClick}) => (
    <LayoutCellContainer table={table} onClick={()=> onClick(x, y, table)}>
        <input type='hidden'/>
        { table ? table.seats : ''}
    </LayoutCellContainer>
);

export default LayoutCell;