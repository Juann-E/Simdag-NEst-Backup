import * as ExcelJS from 'exceljs';

export class ExcelBuilderStockPangan {
  static async buildExcel(
    komoditasName: string,
    start: string,
    end: string,
    data: any[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Report Stock Pangan');

    // Header
    sheet.addRow([`LAPORAN STOCK PANGAN ${komoditasName.toUpperCase()} PERIODE : ${start} - ${end}`]);
    sheet.addRow(['DINAS PERDAGANGAN KOTA SALATIGA']);
    sheet.addRow([]);

    // Header kolom
    const headerRow = ['No', 'Tahun', 'Bulan', 'Komoditas', 'Distributor', 'Stock Awal', 'Pengadaan', 'Penyaluran', 'Keterangan'];
    sheet.addRow(headerRow);

    // Data isi
    let no = 1;
    for (const item of data) {
      const row = [
        no,
        item.tahun,
        item.bulan,
        item.komoditas,
        item.distributor,
        item.stock_awal,
        item.pengadaan,
        item.penyaluran,
        item.keterangan || '-',
      ];
      sheet.addRow(row);
      no++;
    }

    // Styling
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.getRow(2).font = { italic: true };
    sheet.getRow(4).font = { bold: true };

    sheet.columns.forEach((col) => {
      col.width = 15;
    });

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }

  static async buildMonthlyExcel(
    bulan: number,
    tahun: number,
    groupedData: any[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Data Stock Pangan');

    // Header utama
    sheet.addRow(['DATA STOCK PANGAN DI TINGKAT DISTRIBUTOR']);
    sheet.addRow([`Bulan ${String(bulan).padStart(2, '0')} Tahun ${tahun}`]);
    sheet.addRow([]);

    // Style untuk header utama
    sheet.getRow(1).font = { bold: true, size: 14 };
    sheet.getRow(2).font = { bold: true, size: 12 };
    sheet.getRow(1).alignment = { horizontal: 'center' };
    sheet.getRow(2).alignment = { horizontal: 'center' };

    let currentRow = 4;

    // Loop untuk setiap komoditas
    groupedData.forEach((komoditasGroup, index) => {
      // Header komoditas
      sheet.addRow([`Komoditas ${komoditasGroup.komoditas.toUpperCase()}`]);
      sheet.getRow(currentRow).font = { bold: true, size: 12 };
      currentRow++;

      // Header tabel
      const headerRow = ['NO', 'Distributor', 'Stock Awal', 'Sat', 'Pengadaan', 'Sat', 'Penyaluran', 'Sat', 'Stock Akhir', 'Sat'];
      sheet.addRow(headerRow);
      sheet.getRow(currentRow).font = { bold: true };
      sheet.getRow(currentRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
      currentRow++;

      // Data distributor
      komoditasGroup.data.forEach((item, idx) => {
        const row = [
          idx + 1,
          item.distributor,
          item.stockAwal,
          item.satuan,
          item.pengadaan,
          item.satuan,
          item.penyaluran,
          item.satuan,
          item.stockAkhir,
          item.satuan
        ];
        sheet.addRow(row);
        currentRow++;
      });

      // Row total
      const totalRow = [
        '',
        'TOTAL',
        komoditasGroup.totals.stockAwal,
        '',
        komoditasGroup.totals.pengadaan,
        '',
        komoditasGroup.totals.penyaluran,
        '',
        komoditasGroup.totals.stockAkhir,
        ''
      ];
      sheet.addRow(totalRow);
      sheet.getRow(currentRow).font = { bold: true };
      sheet.getRow(currentRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFCC00' }
      };
      currentRow++;

      // Spasi antar komoditas
      if (index < groupedData.length - 1) {
        sheet.addRow([]);
        currentRow++;
      }
    });

    // Styling kolom
    sheet.columns = [
      { width: 5 },   // NO
      { width: 25 },  // Distributor
      { width: 12 },  // Stock Awal
      { width: 8 },   // Sat
      { width: 12 },  // Pengadaan
      { width: 8 },   // Sat
      { width: 12 },  // Penyaluran
      { width: 8 },   // Sat
      { width: 12 },  // Stock Akhir
      { width: 8 }    // Sat
    ];

    // Border untuk semua cell yang terisi
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 2) {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      }
    });

    // Merge cells untuk header utama
    sheet.mergeCells('A1:J1');
    sheet.mergeCells('A2:J2');

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}