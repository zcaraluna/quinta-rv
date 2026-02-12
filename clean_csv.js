const fs = require('fs');

const content = fs.readFileSync('corregir reservaciones.csv', 'binary');
const buffer = Buffer.from(content, 'binary');
const text = buffer.toString('latin1');

// Function from normalize-phones.js
function normalizePhone(raw) {
    if (!raw) return '';
    let digits = String(raw).replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('595')) digits = '0' + digits.slice(3);
    if (digits.length === 9) digits = '0' + digits;
    if (digits.length !== 10) return String(raw);
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
}

function fixEncoding(str) {
    try {
        // Try to fix common Latin1 vs UTF8 issues (e.g. Ã -> Á)
        return Buffer.from(str, 'latin1').toString('utf8');
    } catch (e) {
        return str;
    }
}

const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
const rawHeaders = lines[0].split(';');
const headers = rawHeaders.map(h => h.trim().replace(/\s+/g, ' '));

const fixedRecords = [];
const seenDates = new Map();

for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(';').map(p => p.trim().replace(/\s+/g, ' '));
    if (parts.length < 2) continue;

    const record = {};
    headers.forEach((h, idx) => {
        let val = parts[idx] || '';
        if (h === 'Nombre' && val.includes('Ã')) {
            val = fixEncoding(val);
        }
        record[h || `Col${idx}`] = val;
    });

    // Apply fixes
    if (record['Telefono']) {
        record['Telefono'] = normalizePhone(record['Telefono']);
    }

    // Priority: use date from 'Respuesta' if it exists and looks like a date correction
    let dateStr = record['Fecha y Turno'];
    let resp = record['Respuesta'] || '';

    // Check if Respuesta contains a date/slot (e.g. "13/02 - día", "14/02 - noche")
    const respMatch = resp.match(/(\d{2}\/\d{2})\s*-\s*(\w+)/);
    if (respMatch) {
        // Assume year 2026 if not specified
        const year = dateStr.match(/\d{4}/) ? dateStr.match(/\d{4}/)[0] : '2026';
        dateStr = `${respMatch[1]}/${year} - ${respMatch[2]}`;
    }

    // Manual overrides
    if (record['Nombre'].startsWith('MARCELINO MARTINEZ')) {
        dateStr = '19/02/2026 - Noche';
    }

    const match = dateStr.match(/(\d{2}\/\d{2}\/\d{4})\s*-\s*(.+)/);
    if (match) {
        record['Fecha'] = match[1];
        const slotInput = match[2].trim().toLowerCase();

        if (slotInput === '1' || slotInput.includes('noche') || slotInput.includes('night')) {
            record['Slot'] = '1';
        } else {
            record['Slot'] = '0';
        }



        const key = `${record['Fecha']}-${record['Slot']}`;
        if (seenDates.has(key)) {
            record['DUPLICATE'] = true;
            seenDates.get(key).push(record.Nombre);
        } else {
            seenDates.set(key, [record.Nombre]);
        }
    }



    // Map Status
    if (record['Estado'] || record['Col3']) {
        const estado = (record['Estado'] || record['Col3']).toLowerCase();
        if (estado.includes('reservado')) record['Status'] = 'RESERVED';
        else if (estado.includes('confirmado')) record['Status'] = 'CONFIRMED';
        else record['Status'] = 'PENDING_PAYMENT';
    }

    fixedRecords.push(record);
}

// Output as a clean report
console.log('--- RESUMEN DE CORRECCIONES ---');
fixedRecords.forEach((r, i) => {
    let msg = `${i + 1}. ${r.Nombre} | ${r.Telefono} | ${r.Fecha} (${r.Slot}) | ${r.Status}`;
    if (r.DUPLICATE) msg += ' [!! DUPLICADO !!]';
    if (r.Respuesta && r.Respuesta.toLowerCase().includes('cancelar')) msg += ' [?? CANCELACIÓN ??]';
    console.log(msg);
});

fs.writeFileSync('corregido.json', JSON.stringify(fixedRecords, null, 2));

// Generate clean CSV
const csvHeaders = ['Nombre', 'Telefono', 'Fecha', 'Slot', 'Status', 'Respuesta'];
const csvLines = [csvHeaders.join(';')];
fixedRecords.forEach(r => {
    const line = [
        r.Nombre,
        r.Telefono,
        r.Fecha,
        r.Slot,
        r.Status,
        r.Respuesta || ''
    ].join(';');
    csvLines.push(line);
});
fs.writeFileSync('corregido.csv', csvLines.join('\n'), 'latin1');
