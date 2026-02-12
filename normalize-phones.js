// Script para normalizar números de teléfono en el Excel de reservas
// Uso:
//   1) npm install
//   2) npm run normalize-phones
//
// Lee el archivo "reservas(2).xlsx" en la raíz del proyecto
// y genera "reservas-normalizado.xlsx" con la columna de teléfono
// en formato: 098x xxx xxx

const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

const INPUT_FILE = path.join(__dirname, 'reservas(2).xlsx');
const OUTPUT_FILE = path.join(__dirname, 'reservas-normalizado.xlsx');

function normalizePhone(raw) {
  if (!raw) return '';

  // Convertir a string y dejar solo dígitos
  let digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';

  // Si viene con 595 al inicio, lo convertimos a 0XXXXXXXXX
  if (digits.startsWith('595')) {
    digits = '0' + digits.slice(3);
  }

  // Si tiene 9 dígitos, asumimos que falta un 0 delante
  if (digits.length === 9) {
    digits = '0' + digits;
  }

  // Si no tiene 10 dígitos al final, devolvemos el valor original sin tocar
  if (digits.length !== 10) {
    return String(raw);
  }

  // Formato 098x xxx xxx
  return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function main() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`No se encontró el archivo de entrada: ${INPUT_FILE}`);
    process.exit(1);
  }

  console.log(`Leyendo archivo: ${INPUT_FILE}`);
  const workbook = xlsx.readFile(INPUT_FILE);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Trabajamos como AOA (array de filas)
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  if (data.length === 0) {
    console.error("La hoja está vacía.");
    process.exit(1);
  }

  const header = data[0];

  // Intentamos encontrar la columna de teléfono por nombre
  const phoneColIndex = header.findIndex((h) => {
    if (!h) return false;
    const s = String(h).toLowerCase();
    return s.includes("tel") || s.includes("whats");
  });

  if (phoneColIndex === -1) {
    console.error("No se encontró una columna de teléfono (que contenga 'tel' o 'whats' en el encabezado).");
    process.exit(1);
  }

  console.log(`Columna de teléfono detectada en índice ${phoneColIndex} (${header[phoneColIndex]}).`);

  // Normalizar todos los teléfonos a partir de la fila 2
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row) continue;
    const current = row[phoneColIndex];
    if (current == null || current === "") continue;
    row[phoneColIndex] = normalizePhone(current);
  }

  const newSheet = xlsx.utils.aoa_to_sheet(data);
  const newWorkbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(newWorkbook, newSheet, sheetName);

  xlsx.writeFile(newWorkbook, OUTPUT_FILE);
  console.log(`Archivo generado: ${OUTPUT_FILE}`);
}

main();

