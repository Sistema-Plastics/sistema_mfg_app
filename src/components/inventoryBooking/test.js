import React, { useRef, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const MyDataGrid = () => {
    const gridRef = useRef(null); // Create a reference to the DataGrid component

    const jobOperColumns = [
        { field: 'OprSeq', headerName: 'Opr Seq' },
        { field: 'OpCode', headerName: 'Opr Code' },
        { field: 'OpDesc', headerName: 'Opr Description' },
        { field: 'RunQty', headerName: 'Required Qty', align: 'right' },
        { field: 'IUM', headerName: 'UOM' },
        { field: 'EstSetHours', headerName: 'Est. Setup Hours', align: 'right' },
        { field: 'EstProdHours', headerName: 'Est. Prod Hours', align: 'right' },
        { field: 'ExpCycTm', headerName: 'Cycle Time', align: 'right' },
        { field: 'ProdStandard', headerName: 'Production Std', align: 'right' },
        { field: 'StdFormat', headerName: '', align: 'right' },
    ];

    const jobOperRows = [
        { id: 1, OprSeq: '001', OpCode: 'A', OpDesc: 'Description A', RunQty: 100, IUM: 'pcs', EstSetHours: 2, EstProdHours: 5, ExpCycTm: 10, ProdStandard: 'Standard A', StdFormat: '' },
        { id: 2, OprSeq: '002', OpCode: 'B', OpDesc: 'Description B', RunQty: 150, IUM: 'pcs', EstSetHours: 3, EstProdHours: 6, ExpCycTm: 12, ProdStandard: 'Standard B', StdFormat: '' },
        // Add more rows as needed
    ];

    // Trigger column resizing after the DataGrid is mounted
    useEffect(() => {
        if (gridRef.current) {
            // Get the DataGrid API and call autoSizeColumns on the columns you want to resize
            gridRef.current.api.autoSizeColumns(['OprSeq', 'OpCode', 'OpDesc', 'RunQty', 'IUM', 'EstSetHours', 'EstProdHours', 'ExpCycTm', 'ProdStandard', 'StdFormat']);
        }
    }, []);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                ref={gridRef} // Assign the ref to the DataGrid component
                rows={jobOperRows}
                columns={jobOperColumns}
                pageSize={5}
            />
        </div>
    );
};

export default MyDataGrid;
