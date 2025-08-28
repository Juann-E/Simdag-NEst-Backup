import * as ExcelJS from 'exceljs';

export class ExcelBuilder {
  static async buildExcel(
    pasarName: string,
    start: string,
    end: string,
    tanggalList: string[],
    pivot: Record<string, any>,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report');

    // Header
    sheet.addRow([`PASAR ${pasarName.toUpperCase()} TANGGAL : ${start} - ${end}`]);
    sheet.addRow(['DINAS PERDAGANGAN KOTA SALATIGA']);
    sheet.addRow([]);

    // Header kolom
    const headerRow = ['No', 'Bahan Pokok', ...tanggalList];
    sheet.addRow(headerRow);

    // Data isi
    let no = 1;
    for (const barang in pivot) {
      const row = [
        no,
        barang,
        ...tanggalList.map((tgl) =>
          pivot[barang].harga[tgl]
            ? `Rp${Number(pivot[barang].harga[tgl]).toLocaleString('id-ID')}`
            : '-',
        ),
      ];
      sheet.addRow(row);
      no++;
    }

    // Styling
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.getRow(2).font = { italic: true };
    sheet.getRow(4).font = { bold: true };

    sheet.columns.forEach((col) => {
      col.width = 20;
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}
