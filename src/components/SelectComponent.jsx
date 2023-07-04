import { useState } from "react";
import { Select, FormControl, MenuItem, InputLabel, Box } from "@mui/material";

export default function SelectComponent({
  menuItems,
  menuName,
  getSelectedValue,
  label,
  defaultValue,
}) {
  const [selectedItem, setSelectedItem] = useState(
    defaultValue === undefined ? "" : defaultValue
  );
  const handleChange = (event) => {
    setSelectedItem(event.target.value);
    getSelectedValue(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{menuName}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedItem}
          label={label}
          onChange={handleChange}
        >
          {menuItems &&
            menuItems.map((items) => (
              <MenuItem key={items._id} value={items.name}>
                {items.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
  );
}
