// One-off generator for a minimal, VALID placeholder PDF at static/resume.pdf.
// Leul replaces this with his real CV. Kept as a script so the byte offsets in
// the xref table are always computed correctly.
const fs = require('fs');
const path = require('path');

const objs = [
	'<< /Type /Catalog /Pages 2 0 R >>',
	'<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
	'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
	'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
];
const stream =
	'BT /F1 22 Tf 70 720 Td (Leul Tesfaye - Resume) Tj 0 -30 Td /F1 12 Tf ' +
	'(Placeholder. Replace static/resume.pdf with your real CV.) Tj ET';
objs.push(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);

let pdf = '%PDF-1.4\n';
const offsets = [];
objs.forEach((body, i) => {
	offsets.push(pdf.length);
	pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefPos = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
for (const off of offsets) pdf += String(off).padStart(10, '0') + ' 00000 n \n';
pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`;

const out = path.join(__dirname, '..', 'static', 'resume.pdf');
fs.writeFileSync(out, pdf, 'latin1');
console.log('wrote', out, pdf.length, 'bytes');
