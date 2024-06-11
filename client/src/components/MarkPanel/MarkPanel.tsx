import React from "react";
import { Box, Chip } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import { setSelectedMark } from "../../slices/stockSlice";

export const MarkPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { marks, selectedMark } = useSelector(
    (state: RootState) => state.stock
  );

  const handleMarkClick = (mark: string) => {
    dispatch(setSelectedMark(mark));
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
      {marks.map((markCount) => (
        <Chip
          key={markCount.mark}
          label={`${markCount.mark} (${markCount.count})`}
          clickable
          color={selectedMark === markCount.mark ? "primary" : "default"}
          onClick={() => handleMarkClick(markCount.mark)}
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
};
