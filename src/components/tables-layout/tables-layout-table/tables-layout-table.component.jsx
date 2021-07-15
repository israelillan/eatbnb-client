import React from 'react'
import {useDrag} from 'react-dnd'
import {TablesLayoutTableContainer, ReferenceContainer, SeatsContainer} from "./tables-layout-table.styles";

export const TABLE_DRAG_TYPE = 'LayoutTable';

const TablesLayoutTable = ({table, onTableClick, allowDragging}) => {
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
        <TablesLayoutTableContainer ref={allowDragging ? drag : null} allowDragging={allowDragging} isDraggin={isDragging} table={table} onClick={() => onTableClick(table)}>
            <ReferenceContainer>{`#${table.reference}`}</ReferenceContainer>
            <SeatsContainer>{`[${table.seats}]`}</SeatsContainer>
        </TablesLayoutTableContainer>
    );
}

export default TablesLayoutTable;