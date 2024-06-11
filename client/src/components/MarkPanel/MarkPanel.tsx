import React from "react";
import { Box, Chip } from "@mui/material";
import { MarkCount } from "../../types";

interface MarkPanelProps {
  marks: MarkCount[];
  selectedMark: string;
  onMarkClick: (mark: string) => void;
}

export const MarkPanel: React.FC<MarkPanelProps> = ({
  marks,
  selectedMark,
  onMarkClick,
}) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
      {marks.map((markCount) => (
        <Chip
          key={markCount.mark}
          label={`${markCount.mark} (${markCount.count})`}
          clickable
          color={selectedMark === markCount.mark ? "primary" : "default"}
          onClick={() => onMarkClick(markCount.mark)}
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
};
