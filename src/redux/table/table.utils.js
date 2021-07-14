export const tableFromBackendObject = (backendObject) => {
    return {backendObject: backendObject, ...backendObject.attributes};
}

export const updateTable = (tables, tableToUpdate) => {
    return tables.map(table =>
        table.backendObject.id === tableToUpdate.backendObject.id
            ? tableToUpdate
            : table
    );
};
export const removeTable = (tables, tableToRemove) => {
    return tables.filter(table => table.backendObject.id !== tableToRemove.backendObject.id);
};