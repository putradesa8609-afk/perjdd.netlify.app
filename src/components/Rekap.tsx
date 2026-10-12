import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { PerjalananDinas } from '../types';

interface RekapProps {
  data: PerjalananDinas[];
}

const Rekap: React.FC<RekapProps> = ({ data }) => {
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');

  const filteredData = data.filter(item => {
    const date = new Date(item.tanggalBerangkat);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    
    let pass = true;
    if (filterBulan) pass = pass && month === filterBulan;
    if (filterTahun) pass = pass && year === filterTahun;
    return pass;
  });

  // Statistics
  const totalPerjalanan = filteredData.length;
  const totalPersonil = filteredData.reduce((sum, item) => sum + item.personil.length, 0);
  const totalBiaya = filteredData.reduce((sum, item) => sum + item.totalBiayaKeseluruhan, 0);
  const totalTransport = filteredData.reduce((sum, item) => 
    sum + item.personil.reduce((s, p) => s + p.biayaTransport, 0), 0);
  const totalUangSaku = filteredData.reduce((sum, item) => 
    sum + item.personil.reduce((s, p) => s + p.biayaUangSaku, 0), 0);
  const rataRataBiaya = totalPerjalanan > 0 ? totalBiaya / totalPerjalanan : 0;
  const totalHari = filteredData.reduce((sum, item) => sum + item.lamaPerjalanan, 0);

  // Group by lokasi
  const lokasiGroups = filteredData.reduce((acc, item) => {
    const key = item.lokasiPerjalanan;
    if (!acc[key]) {
      acc[key] = { count: 0, totalBiaya: 0, personil: new Set<string>() };
    }
    acc[key].count += 1;
    acc[key].totalBiaya += item.totalBiayaKeseluruhan;
    item.personil.forEach(p => acc[key].personil.add(p.nama));
    return acc;
  }, {} as Record<string, { count: number; totalBiaya: number; personil: Set<string> }>);

  // Group by personil
  const personilGroups = filteredData.reduce((acc, item) => {
    item.personil.forEach(p => {
      const key = p.nama;
      if (!acc[key]) {
        acc[key] = { count: 0, totalBiaya: 0, jabatan: p.jabatan, totalHari: 0 };
      }
      acc[key].count += 1;
      acc[key].totalBiaya += p.totalBiaya;
      acc[key].totalHari += item.lamaPerjalanan;
    });
    return acc;
  }, {} as Record<string, { count: number; totalBiaya: number; jabatan: string; totalHari: number }>);

  // Get unique years
  const years = [...new Set(data.map(item => new Date(item.tanggalBerangkat).getFullYear()))].sort();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const exportRekapToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Rekapitulasi Umum
    const rekapData = [
      ['REKAPITULASI PERJALANAN DINAS'],
      [''],
      ['Ringkasan'],
      ['Total Surat Perintah', totalPerjalanan],
      ['Total Personil Dituraskan', totalPersonil],
      ['Total Hari Perjalanan', totalHari],
      ['Total Biaya Transport', totalTransport],
      ['Total Uang Saku', totalUangSaku],
      ['Total Keseluruhan', totalBiaya],
      ['Rata-rata Biaya per Surat', rataRataBiaya],
      [''],
      ['Rekap per Lokasi'],
      ['Lokasi', 'Jumlah Surat', 'Total Personil', 'Total Biaya'],
      ...Object.entries(lokasiGroups).map(([lokasi, info]) => [
        lokasi, info.count, info.personil.size, info.totalBiaya
      ]),
      [''],
      ['Rekap per Personil'],
      ['Nama', 'Jabatan', 'Jumlah Perjalanan', 'Total Hari', 'Total Biaya'],
      ...Object.entries(personilGroups).map(([nama, info]) => [
        nama, info.jabatan, info.count, info.totalHari, info.totalBiaya
      ]),
    ];

    const ws1 = XLSX.utils.aoa_to_sheet(rekapData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Rekapitulasi');

    // Sheet 2: Detail Data
    const detailData: any[] = [];
    filteredData.forEach((item) => {
      item.personil.forEach((p) => {
        detailData.push({
          'Nomor Surat': item.nomorSurat,
          'Tgl Berangkat': item.tanggalBerangkat,
          'Tgl Kembali': item.tanggalKembali,
          'Nama Personil': p.nama,
          'Jabatan': p.jabatan,
          'Tujuan': item.tujuanPerjalanan,
          'Lokasi': item.lokasiPerjalanan,
          'Lama (Hari)': item.lamaPerjalanan,
          'Laporan': item.laporanHasil,
          'Pejabat': item.pejabatPemberiPerintah,
          'Transport': p.biayaTransport,
          'Uang Saku': p.biayaUangSaku,
          'Total Biaya': p.totalBiaya,
        });
      });
    });

    const ws2 = XLSX.utils.json_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Detail Data');

    XLSX.writeFile(wb, `Rekap_Perjalanan_Dinas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const bulanOptions = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  return (
    <div className="space-y-6">
      {/* Filter & Export */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Rekapitulasi Perjalanan Dinas</h2>
              <p className="text-sm text-gray-500">Ringkasan dan analisis data perjalanan dinas</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Semua Bulan</option>
              {bulanOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Semua Tahun</option>
              {years.map(year => (
                <option key={year} value={String(year)}>{year}</option>
              ))}
            </select>
            <button
              onClick={exportRekapToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Rekap
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Surat</p>
              <p className="text-3xl font-bold mt-1">{totalPerjalanan}</p>
              <p className="text-blue-200 text-xs mt-1">perintah perjalanan</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Personil</p>
              <p className="text-3xl font-bold mt-1">{totalPersonil}</p>
              <p className="text-indigo-200 text-xs mt-1">orang ditugaskan</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Biaya</p>
              <p className="text-xl font-bold mt-1">{formatCurrency(totalBiaya)}</p>
              <p className="text-green-200 text-xs mt-1">seluruh perjalanan</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Total Hari</p>
              <p className="text-3xl font-bold mt-1">{totalHari}</p>
              <p className="text-amber-200 text-xs mt-1">hari perjalanan</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-amber-100 p-1.5 rounded-lg">💰</span>
          Rincian Biaya
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 font-medium">Total Biaya Transport</p>
            <p className="text-2xl font-bold text-blue-700 mt-2">{formatCurrency(totalTransport)}</p>
            <div className="mt-2 bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: totalBiaya > 0 ? `${(totalTransport / totalBiaya) * 100}%` : '0%' }}
              ></div>
            </div>
            <p className="text-xs text-blue-500 mt-1">
              {totalBiaya > 0 ? ((totalTransport / totalBiaya) * 100).toFixed(1) : 0}% dari total
            </p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 font-medium">Total Uang Saku</p>
            <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(totalUangSaku)}</p>
            <div className="mt-2 bg-green-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: totalBiaya > 0 ? `${(totalUangSaku / totalBiaya) * 100}%` : '0%' }}
              ></div>
            </div>
            <p className="text-xs text-green-500 mt-1">
              {totalBiaya > 0 ? ((totalUangSaku / totalBiaya) * 100).toFixed(1) : 0}% dari total
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-600 font-medium">Total Keseluruhan</p>
            <p className="text-2xl font-bold text-purple-700 mt-2">{formatCurrency(totalBiaya)}</p>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-full"></div>
            </div>
            <p className="text-xs text-purple-500 mt-1">100% keseluruhan biaya</p>
          </div>
        </div>
      </div>

      {/* Rekap per Lokasi & Personil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rekap per Lokasi */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 p-1.5 rounded-lg">📍</span>
            Rekap per Lokasi
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-blue-700">Lokasi</th>
                  <th className="px-3 py-2 text-center font-semibold text-blue-700">Jumlah Surat</th>
                  <th className="px-3 py-2 text-center font-semibold text-blue-700">Personil</th>
                  <th className="px-3 py-2 text-right font-semibold text-blue-700">Total Biaya</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(lokasiGroups).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  Object.entries(lokasiGroups).map(([lokasi, info]) => (
                    <tr key={lokasi} className="border-b border-gray-100">
                      <td className="px-3 py-2.5 font-medium">{lokasi}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {info.count} surat
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {info.personil.size} org
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatCurrency(info.totalBiaya)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rekap per Personil */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-green-100 p-1.5 rounded-lg">👥</span>
            Rekap per Personil
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-green-700">Nama</th>
                  <th className="px-3 py-2 text-center font-semibold text-green-700">Jumlah</th>
                  <th className="px-3 py-2 text-center font-semibold text-green-700">Hari</th>
                  <th className="px-3 py-2 text-right font-semibold text-green-700">Total Biaya</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(personilGroups).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-gray-500">Belum ada data</td>
                  </tr>
                ) : (
                  Object.entries(personilGroups).map(([nama, info]) => (
                    <tr key={nama} className="border-b border-gray-100">
                      <td className="px-3 py-2.5">
                        <p className="font-medium">{nama}</p>
                        <p className="text-xs text-gray-500">{info.jabatan}</p>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {info.count}x
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center text-gray-600">{info.totalHari} hr</td>
                      <td className="px-3 py-2.5 text-right font-mono text-xs">{formatCurrency(info.totalBiaya)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rekap;
