export const updateTable = (tables, tableToUpdate) => {
    return tables.map(table =>
        table.id === tableToUpdate.id
            ? tableToUpdate
            : table
    );
};
export const removeTable = (tables, tableToRemove) => {
    return tables.filter(table => table.id !== tableToRemove.id);
};