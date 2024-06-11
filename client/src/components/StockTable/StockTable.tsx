import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Box,
} from "@mui/material";
import { Stock } from "../../types";

interface StockTableProps {
  data: Stock[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
}

export const StockTable: React.FC<StockTableProps> = ({
  data,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const columns = [
    { id: "_id", label: "ID" },
    { id: "markModel", label: "Марка/Модель" },
    { id: "modification", label: "Модификация" },
    { id: "equipmentName", label: "Комплектация" },
    { id: "price", label: "Стоимость" },
    { id: "createdAt", label: "Дата создания" },
  ];

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item._id}</TableCell>
                  <TableCell>{`${item.mark}/${item.model}`}</TableCell>
                  <TableCell>{`${item.engine.power} ${item.engine.volume} ${item.engine.transmission} ${item.engine.fuel} ${item.drive}`}</TableCell>
                  <TableCell>{item.equipmentName}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("ru-RU").format(item.price)}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={onPageChange}
        />
      </Box>
    </>
  );
};
