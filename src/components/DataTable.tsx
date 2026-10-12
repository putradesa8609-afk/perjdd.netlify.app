import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { PerjalananDinas } from '../types';

interface DataTableProps {
  data: PerjalananDinas[];
  onEdit: (item: PerjalananDinas) => void;
  onDelete: (id: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<PerjalananDinas | null>(null);

  const filteredData = data.filter(item => {
    const search = searchTerm.toLowerCase();
    const personilNames = item.personil.map(p => p.nama.toLowerCase()).join(' ');
    const personilNips = item.personil.map(p => p.nip.toLowerCase()).join(' ');
    return (
      item.nomorSurat.toLowerCase().includes(search) ||
      personilNames.includes(search) ||
      personilNips.includes(search) ||
      item.lokasiPerjalanan.toLowerCase().includes(search) ||
      item.tujuanPerjalanan.toLowerCase().includes(search) ||
      item.pejabatPemberiPerintah.toLowerCase().includes(search) ||
      item.nipPejabat.toLowerCase().includes(search)
    );
  });

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    // Sheet utama: Ringkasan per surat
    const summaryData = data.map((item, index) => ({
      'No': index + 1,
      'Nomor Surat': item.nomorSurat,
      'Tgl Berangkat': item.tanggalBerangkat,
      'Tgl Kembali': item.tanggalKembali,
      'Jumlah Personil': item.personil.length,
      'Nama Personil': item.personil.map(p => p.nama).join(', '),
      'Tujuan': item.tujuanPerjalanan,
      'Lokasi': item.lokasiPerjalanan,
      'Lama (Hari)': item.lamaPerjalanan,
      'NIP Pejabat': item.nipPejabat,
      'Pejabat Pemberi Perintah': item.pejabatPemberiPerintah,
      'Total Biaya (Rp)': item.totalBiayaKeseluruhan,
    }));

    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    ws1['!cols'] = [
      { wch: 5 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
      { wch: 40 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 18 },
      { wch: 25 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Ringkasan');

    // Sheet detail per personil
    const detailData: any[] = [];
    data.forEach((item) => {
      item.personil.forEach((p) => {
        detailData.push({
          'Nomor Surat': item.nomorSurat,
          'Tgl Berangkat': item.tanggalBerangkat,
          'Tgl Kembali': item.tanggalKembali,
          'NIP Personil': p.nip,
          'Nama Personil': p.nama,
          'Jabatan': p.jabatan,
          'Tujuan': item.tujuanPerjalanan,
          'Lokasi': item.lokasiPerjalanan,
          'Lama (Hari)': item.lamaPerjalanan,
          'Laporan Hasil': item.laporanHasil,
          'NIP Pejabat': item.nipPejabat,
          'Pejabat': item.pejabatPemberiPerintah,
          'Biaya Transport (Rp)': p.biayaTransport,
          'Uang Saku (Rp)': p.biayaUangSaku,
          'Total Biaya (Rp)': p.totalBiaya,
        });
      });
    });

    const ws2 = XLSX.utils.json_to_sheet(detailData);
    ws2['!cols'] = [
      { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 25 },
      { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 40 },
      { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 18 },
    ];
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Personil');

    XLSX.writeFile(wb, `Data_Perjalanan_Dinas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Data Perjalanan Dinas</h2>
            <p className="text-sm text-gray-500">
              Total: {data.length} surat | {data.reduce((sum, item) => sum + item.personil.length, 0)} personil
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari data (nama, NIP, lokasi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-72"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-3 py-3 text-left font-semibold">No</th>
              <th className="px-3 py-3 text-left font-semibold">No. Surat</th>
              <th className="px-3 py-3 text-left font-semibold">Tgl Berangkat</th>
              <th className="px-3 py-3 text-left font-semibold">Tgl Kembali</th>
              <th className="px-3 py-3 text-left font-semibold">Personil</th>
              <th className="px-3 py-3 text-left font-semibold">Lokasi</th>
              <th className="px-3 py-3 text-left font-semibold">Pejabat</th>
              <th className="px-3 py-3 text-center font-semibold">Lama</th>
              <th className="px-3 py-3 text-right font-semibold">Total Biaya</th>
              <th className="px-3 py-3 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Belum ada data perjalanan dinas</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-3 py-3 font-medium text-gray-600">{index + 1}</td>
                  <td className="px-3 py-3 font-mono text-xs">{item.nomorSurat}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatDate(item.tanggalBerangkat)}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatDate(item.tanggalKembali)}</td>
                  <td className="px-3 py-3">
                    <div className="max-w-xs">
                      {item.personil.map((p, i) => (
                        <div key={i} className="text-xs leading-relaxed">
                          <div className="font-medium">{p.nama}</div>
                          <div className="text-gray-400 font-mono text-[10px]">NIP: {p.nip}</div>
                          <div className="text-gray-500 text-[10px]">{p.jabatan}</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3">{item.lokasiPerjalanan}</td>
                  <td className="px-3 py-3">
                    <div className="text-xs">
                      <div className="font-medium">{item.pejabatPemberiPerintah}</div>
                      <div className="text-gray-400 font-mono text-[10px]">NIP: {item.nipPejabat}</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      {item.lamaPerjalanan} hr
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-xs font-bold text-green-700">
                    {formatCurrency(item.totalBiayaKeseluruhan)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                            onDelete(item.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {filteredData.length > 0 && (
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td colSpan={8} className="px-3 py-3 text-right">TOTAL:</td>
                <td className="px-3 py-3 text-right font-mono text-xs text-green-700">
                  {formatCurrency(filteredData.reduce((sum, item) => sum + item.totalBiayaKeseluruhan, 0))}
                </td>
                <td></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-lg">Detail Perjalanan Dinas</h3>
              <button onClick={() => setSelectedItem(null)} className="text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Nomor Surat</p>
                  <p className="font-medium">{selectedItem.nomorSurat}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Pejabat Pemberi Perintah</p>
                  <p className="font-medium">{selectedItem.pejabatPemberiPerintah}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">NIP: {selectedItem.nipPejabat}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Tanggal Berangkat</p>
                  <p className="font-medium">{formatDate(selectedItem.tanggalBerangkat)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Tanggal Kembali</p>
                  <p className="font-medium">{formatDate(selectedItem.tanggalKembali)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Tujuan Perjalanan</p>
                  <p className="font-medium">{selectedItem.tujuanPerjalanan}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Lokasi</p>
                  <p className="font-medium">{selectedItem.lokasiPerjalanan}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase">Lama Perjalanan</p>
                  <p className="font-medium">{selectedItem.lamaPerjalanan} hari</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-600 uppercase">Total Biaya Keseluruhan</p>
                  <p className="font-bold text-green-700">{formatCurrency(selectedItem.totalBiayaKeseluruhan)}</p>
                </div>
              </div>

              {/* Personil Detail */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
                  <h4 className="font-semibold text-blue-700 text-sm">👥 Daftar Personil ({selectedItem.personil.length} orang)</h4>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">No</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">NIP</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Nama</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Jabatan</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Transport</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Uang Saku</th>
                      <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem.personil.map((p, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs">{p.nip}</td>
                        <td className="px-3 py-2 font-medium">{p.nama}</td>
                        <td className="px-3 py-2 text-gray-600">{p.jabatan}</td>
                        <td className="px-3 py-2 text-right font-mono text-xs">{formatCurrency(p.biayaTransport)}</td>
                        <td className="px-3 py-2 text-right font-mono text-xs">{formatCurrency(p.biayaUangSaku)}</td>
                        <td className="px-3 py-2 text-right font-mono text-xs font-bold text-green-700">{formatCurrency(p.totalBiaya)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 font-bold">
                    <tr>
                      <td colSpan={4} className="px-3 py-2 text-right text-xs">TOTAL:</td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        {formatCurrency(selectedItem.personil.reduce((s, p) => s + p.biayaTransport, 0))}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs">
                        {formatCurrency(selectedItem.personil.reduce((s, p) => s + p.biayaUangSaku, 0))}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs text-green-700">
                        {formatCurrency(selectedItem.totalBiayaKeseluruhan)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 uppercase mb-1">Laporan Hasil Pelaksanaan</p>
                <p className="text-sm text-gray-700">{selectedItem.laporanHasil}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
