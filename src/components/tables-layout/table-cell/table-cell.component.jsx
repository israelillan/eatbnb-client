import React from 'react'
import {useDrag} from 'react-dnd'
import {TableCellContainer, ReferenceContainer, SeatsContainer} from "./table-cell.styles";

export const TABLE_DRAG_TYPE = 'LayoutTable';

const TableCell = ({table, onTableClick, allowDragging}) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: TABLE_DRAG_TYPE,
        item: () => {
            return table;
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <TableCellContainer ref={allowDragging ? drag : null} table={table} onClick={() => onTableClick(table)}
                            isDragging={isDragging} allowDragging={allowDragging}>
            <ReferenceContainer>{`#${table.reference}`}</ReferenceContainer>
            <SeatsContainer>{`[${table.seats}]`}</SeatsContainer>
        </TableCellContainer>
    );
}

export default TableCell;