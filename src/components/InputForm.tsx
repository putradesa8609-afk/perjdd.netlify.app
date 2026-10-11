import React, { useState, useEffect } from 'react';
import { PerjalananDinas } from '../types';

interface InputFormProps {
  onSubmit: (data: PerjalananDinas) => void;
  editData: PerjalananDinas | null;
  onCancelEdit: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, editData, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    nomorSurat: '',
    tanggalBerangkat: '',
    tanggalKembali: '',
    namaPersonil: '',
    jabatanPersonil: '',
    tujuanPerjalanan: '',
    lokasiPerjalanan: '',
    laporanHasil: '',
    pejabatPemberiPerintah: '',
    biayaTransport: '0',
    biayaUangSaku: '0',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nomorSurat: editData.nomorSurat,
        tanggalBerangkat: editData.tanggalBerangkat,
        tanggalKembali: editData.tanggalKembali,
        namaPersonil: editData.namaPersonil,
        jabatanPersonil: editData.jabatanPersonil,
        tujuanPerjalanan: editData.tujuanPerjalanan,
        lokasiPerjalanan: editData.lokasiPerjalanan,
        laporanHasil: editData.laporanHasil,
        pejabatPemberiPerintah: editData.pejabatPemberiPerintah,
        biayaTransport: String(editData.biayaTransport),
        biayaUangSaku: String(editData.biayaUangSaku),
      });
    }
  }, [editData]);

  const calculateLamaPerjalanan = (): number => {
    if (formData.tanggalBerangkat && formData.tanggalKembali) {
      const berangkat = new Date(formData.tanggalBerangkat);
      const kembali = new Date(formData.tanggalKembali);
      const diffTime = Math.abs(kembali.getTime() - berangkat.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lamaPerjalanan = calculateLamaPerjalanan();
    const totalBiaya = Number(formData.biayaTransport) + Number(formData.biayaUangSaku);
    
    const data: PerjalananDinas = {
      id: editData ? editData.id : Date.now().toString(),
      nomorSurat: formData.nomorSurat,
      tanggalBerangkat: formData.tanggalBerangkat,
      tanggalKembali: formData.tanggalKembali,
      namaPersonil: formData.namaPersonil,
      jabatanPersonil: formData.jabatanPersonil,
      tujuanPerjalanan: formData.tujuanPerjalanan,
      lokasiPerjalanan: formData.lokasiPerjalanan,
      lamaPerjalanan,
      laporanHasil: formData.laporanHasil,
      pejabatPemberiPerintah: formData.pejabatPemberiPerintah,
      biayaTransport: Number(formData.biayaTransport),
      biayaUangSaku: Number(formData.biayaUangSaku),
      totalBiaya,
      createdAt: editData ? editData.createdAt : new Date().toISOString(),
    };

    onSubmit(data);
    
    // Reset form
    setFormData({
      nomorSurat: '',
      tanggalBerangkat: '',
      tanggalKembali: '',
      namaPersonil: '',
      jabatanPersonil: '',
      tujuanPerjalanan: '',
      lokasiPerjalanan: '',
      laporanHasil: '',
      pejabatPemberiPerintah: '',
      biayaTransport: '0',
      biayaUangSaku: '0',
    });
  };

  const handleCancel = () => {
    setFormData({
      nomorSurat: '',
      tanggalBerangkat: '',
      tanggalKembali: '',
      namaPersonil: '',
      jabatanPersonil: '',
      tujuanPerjalanan: '',
      lokasiPerjalanan: '',
      laporanHasil: '',
      pejabatPemberiPerintah: '',
      biayaTransport: '0',
      biayaUangSaku: '0',
    });
    onCancelEdit();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {editData ? 'Edit Data Perjalanan Dinas' : 'Input Data Perjalanan Dinas'}
          </h2>
          <p className="text-sm text-gray-500">Lengkapi formulir di bawah ini</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Surat & Tanggal */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">📄 Informasi Surat & Waktu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Surat *</label>
              <input
                type="text"
                required
                value={formData.nomorSurat}
                onChange={(e) => setFormData({ ...formData, nomorSurat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Contoh: 001/SPT/2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Berangkat *</label>
              <input
                type="date"
                required
                value={formData.tanggalBerangkat}
                onChange={(e) => setFormData({ ...formData, tanggalBerangkat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kembali *</label>
              <input
                type="date"
                required
                value={formData.tanggalKembali}
                onChange={(e) => setFormData({ ...formData, tanggalKembali: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          {formData.tanggalBerangkat && formData.tanggalKembali && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <span className="text-sm font-medium text-blue-700">
                📅 Lama Perjalanan: <span className="font-bold">{calculateLamaPerjalanan()} hari</span>
              </span>
            </div>
          )}
        </div>

        {/* Section 2: Personil */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">👤 Data Personil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Personil *</label>
              <input
                type="text"
                required
                value={formData.namaPersonil}
                onChange={(e) => setFormData({ ...formData, namaPersonil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nama lengkap personil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan *</label>
              <input
                type="text"
                required
                value={formData.jabatanPersonil}
                onChange={(e) => setFormData({ ...formData, jabatanPersonil: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Jabatan personil"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Perjalanan */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">🗺️ Detail Perjalanan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Perjalanan *</label>
              <input
                type="text"
                required
                value={formData.tujuanPerjalanan}
                onChange={(e) => setFormData({ ...formData, tujuanPerjalanan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Tujuan perjalanan dinas"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Perjalanan *</label>
              <input
                type="text"
                required
                value={formData.lokasiPerjalanan}
                onChange={(e) => setFormData({ ...formData, lokasiPerjalanan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Kota/Lokasi tujuan"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Laporan Hasil Pelaksanaan *</label>
            <textarea
              required
              rows={3}
              value={formData.laporanHasil}
              onChange={(e) => setFormData({ ...formData, laporanHasil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Ringkasan laporan hasil pelaksanaan perjalanan dinas..."
            />
          </div>
        </div>

        {/* Section 4: Pejabat & Biaya */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">💰 Pejabat & Biaya</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pejabat Pemberi Perintah *</label>
              <input
                type="text"
                required
                value={formData.pejabatPemberiPerintah}
                onChange={(e) => setFormData({ ...formData, pejabatPemberiPerintah: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nama dan jabatan pejabat pemberi perintah"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biaya Transport (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.biayaTransport}
                onChange={(e) => setFormData({ ...formData, biayaTransport: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uang Saku (Rp) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.biayaUangSaku}
                onChange={(e) => setFormData({ ...formData, biayaUangSaku: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Biaya</label>
              <div className="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-lg text-sm font-bold text-green-700">
                Rp {(Number(formData.biayaTransport) + Number(formData.biayaUangSaku)).toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          {editData && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm transition-colors"
            >
              Batal
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors shadow-md hover:shadow-lg"
          >
            {editData ? '💾 Simpan Perubahan' : '➕ Simpan Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
