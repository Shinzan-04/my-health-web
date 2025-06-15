import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(filtered);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
  const excelBuffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, "registrations.xlsx");
};
