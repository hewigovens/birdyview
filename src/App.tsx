import { useState, useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';

// Import react-grid-layout CSS files
import 'react-grid-layout/css/styles.css';

import './App.css'; // Assuming you have this for other styles

function App() {
  const initialItems: Layout[] = [
    { i: 'a', x: 0, y: 0, w: 6, h: 4 },
    { i: 'b', x: 6, y: 0, w: 6, h: 4 },
  ];
  const initialCols = 10;
  const rowHeight = 30;
  const gridWidth = 1200;

  const [items, setItems] = useState<Layout[]>(initialItems);
  const [columns, setColumns] = useState<number>(initialCols);
  const [newCounter, setNewCounter] = useState<number>(0); // Counter for unique item keys
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const onLayoutChange = useCallback((layout: Layout[]) => {
    // Important: Update the state based on the layout provided by the component
    // This synchronizes your state with the visual grid
    setItems(layout);
  }, []); // No dependencies needed if setItems is stable (which it is)

  const onAddItem = useCallback(() => {
    const newItemId = `new-${newCounter}`;
    setNewCounter(newCounter + 1);
    setItems([
      ...items,
      // Add new item to the bottom, you might need more sophisticated logic
      // for positioning based on available space
      {
        i: newItemId,
        x: (items.length * 2) % columns, // Basic positioning attempt
        y: Infinity, // Puts it at the bottom
        w: 2,
        h: 2,
      },
    ]);
  }, [items, columns, newCounter]);

  const onRemoveItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.i !== itemId));
  }, []); // No dependency needed when using functional update form like this

  const handleSelectWidget = useCallback((itemId: string) => {
    setSelectedItemId((prevSelectedId) => (prevSelectedId === itemId ? null : itemId)); // Toggle selection or select new
  }, []);

  const handleColumnsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCols = parseInt(event.target.value, 10);
    if (!isNaN(newCols) && newCols > 0) {
      setColumns(newCols);
    }
  };

  return (
    <div className="App">
       <Box sx={{ padding: 2 }}>
         <Typography variant="h4" gutterBottom>
           Configurable Dashboard
         </Typography>
         <Stack direction="row" spacing={2} sx={{ marginBottom: 2, alignItems: 'center' }}>
           <TextField
             label="Columns"
             type="number"
             value={columns}
             onChange={handleColumnsChange}
             InputLabelProps={{
               shrink: true,
             }}
             size="small"
             inputProps={{ min: 1 }}
           />
           <Button variant="contained" onClick={onAddItem} startIcon={<AddIcon />}>
             Add Widget
           </Button>
           <Button
             variant="outlined"
             color="secondary"
             onClick={() => {
               if (selectedItemId) {
                 onRemoveItem(selectedItemId);
                 setSelectedItemId(null); // Clear selection after removal
               }
             }}
             disabled={!selectedItemId} // Disable if nothing is selected
             startIcon={<DeleteIcon />}
           >
             Remove Selected
           </Button>
         </Stack>
       </Box>

      {/* Centering Box */}
      <Box sx={{ width: gridWidth, margin: 'auto', border: '1px dashed grey', padding: 1 }}>
        <GridLayout
          className="layout"
          layout={items} // Use state for layout
          cols={columns} // Use state for columns
          rowHeight={rowHeight}
          width={gridWidth}
          onLayoutChange={onLayoutChange} // Update state on layout changes
          compactType="vertical"
          isBounded={true}
          isDraggable={true}
          isResizable={true}
          // Provide a dropping element if you want drag-from-toolbox functionality later
          // droppingItem={{ i: "new", w: 2, h: 2 }}
          // isDroppable={true}
          // onDrop={onDrop} // Implement onDrop handler
        >
          {/* Map through the items state to render grid items */}
          {items.map((item) => (
            <div key={item.i} data-grid={item} onClick={() => handleSelectWidget(item.i)} style={{ cursor: 'pointer' }}>
               {/* Use MUI Paper as the container for each widget */}
               <Paper
                 elevation={3}
                 sx={{
                   height: '100%',
                   display: 'flex',
                   flexDirection: 'column', // Keep column direction
                   overflow: 'hidden', // Prevent content spillover
                   border: selectedItemId === item.i ? '2px solid blue' : 'none', // Highlight selected
                 }}
               >
                 <Box sx={{
                   display: 'flex',
                   justifyContent: 'center',
                   alignItems: 'center',
                   flexGrow: 1, // Allow content to take up space
                 }}>
                   <Typography variant="h6">
                     Widget {item.i.toUpperCase()}
                   </Typography>
                 </Box>
               </Paper>
             </div>
           ))}
        </GridLayout>
      </Box>
    </div>
  );
}

export default App;
