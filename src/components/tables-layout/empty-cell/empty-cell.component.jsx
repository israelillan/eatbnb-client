import React from 'react';
import {TablesLayoutCellContainer} from "./empty-cell.styles";
import {useDrop} from "react-dnd";
import {TABLE_DRAG_TYPE} from "../table-cell/table-cell.component";
import {Paper} from "@material-ui/core";

const EmptyCell = ({x, y, onTableDropped, onClick}) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: TABLE_DRAG_TYPE,
        drop: (item) => {
            if (onTableDropped) {
                onTableDropped(x, y, item);
            }
        },
        canDrop: () => true,
        collect: monitor => ({
            isOver: !!monitor.isOver()
        }),
    }), [x, y])

    return <TablesLayoutCellContainer ref={drop} onClick={onClick} isOver={isOver}>
        <Paper> </Paper>
    </TablesLayoutCellContainer>;
};

export default EmptyCell;