import React from 'react'
import {useDrag} from 'react-dnd'
import {DraggableLayoutTableContainer, ReferenceContainer, SeatsContainer} from "./draggable-layout-table.styles";

export const TABLE_DRAG_TYPE = 'LayoutTable';

const DraggableLayoutTable = ({table, onTableClick}) => {
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
        <DraggableLayoutTableContainer ref={drag} isDraggin={isDragging} table={table} onClick={() => onTableClick(table)}>
            <ReferenceContainer>{`#${table.reference}`}</ReferenceContainer>
            <SeatsContainer>{`[${table.seats}]`}</SeatsContainer>
        </DraggableLayoutTableContainer>
    );
}

export default DraggableLayoutTable;