import React, { useState, useEffect } from 'react';
import { PerjalananDinas, Personil } from '../types';

interface InputFormProps {
  onSubmit: (data: PerjalananDinas) => void;
  editData: PerjalananDinas | null;
  onCancelEdit: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, editData, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    nomorSurat: '',
    tanggalSurat: '',
    tanggalBerangkat: '',
    tanggalKembali: '',
    tujuanPerjalanan: '',
    lokasiPerjalanan: '',
    laporanHasil: '',
    nipPejabat: '',
    pejabatPemberiPerintah: '',
  });

  const [personilList, setPersonilList] = useState<Personil[]>([
    { nip: '', nama: '', jabatan: '', biayaTransport: 0, biayaUangSaku: 0, totalBiaya: 0 }
  ]);

  useEffect(() => {
    if (editData) {
      setFormData({
        nomorSurat: editData.nomorSurat,
        tanggalSurat: editData.tanggalSurat || '',
        tanggalBerangkat: editData.tanggalBerangkat,
        tanggalKembali: editData.tanggalKembali,
        tujuanPerjalanan: editData.tujuanPerjalanan,
        lokasiPerjalanan: editData.lokasiPerjalanan,
        laporanHasil: editData.laporanHasil,
        nipPejabat: editData.nipPejabat || '',
        pejabatPemberiPerintah: editData.pejabatPemberiPerintah,
      });
      setPersonilList(editData.personil.length > 0 ? editData.personil.map(p => ({ ...p, nip: p.nip || '' })) : [
        { nip: '', nama: '', jabatan: '', biayaTransport: 0, biayaUangSaku: 0, totalBiaya: 0 }
      ]);
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

  const handleAddPersonil = () => {
    setPersonilList([...personilList, { nip: '', nama: '', jabatan: '', biayaTransport: 0, biayaUangSaku: 0, totalBiaya: 0 }]);
  };

  const handleRemovePersonil = (index: number) => {
    if (personilList.length > 1) {
      setPersonilList(personilList.filter((_, i) => i !== index));
    }
  };

  const handlePersonilChange = (index: number, field: keyof Personil, value: string | number) => {
    const updated = [...personilList];
    if (field === 'biayaTransport' || field === 'biayaUangSaku') {
      updated[index] = {
        ...updated[index],
        [field]: Number(value),
        totalBiaya: field === 'biayaTransport' 
          ? Number(value) + updated[index].biayaUangSaku
          : updated[index].biayaTransport + Number(value),
      };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setPersonilList(updated);
  };

  const totalBiayaKeseluruhan = personilList.reduce((sum, p) => sum + p.totalBiaya, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lamaPerjalanan = calculateLamaPerjalanan();
    const totalBiaya = personilList.reduce((sum, p) => sum + p.totalBiaya, 0);
    
    const newData: PerjalananDinas = {
      id: editData ? editData.id : Date.now().toString(),
      nomorSurat: formData.nomorSurat,
      tanggalSurat: formData.tanggalSurat,
      tanggalBerangkat: formData.tanggalBerangkat,
      tanggalKembali: formData.tanggalKembali,
      tujuanPerjalanan: formData.tujuanPerjalanan,
      lokasiPerjalanan: formData.lokasiPerjalanan,
      lamaPerjalanan,
      laporanHasil: formData.laporanHasil,
      nipPejabat: formData.nipPejabat,
      pejabatPemberiPerintah: formData.pejabatPemberiPerintah,
      personil: personilList,
      totalBiayaKeseluruhan: totalBiaya,
      createdAt: editData ? editData.createdAt : new Date().toISOString(),
    };

    onSubmit(newData);
    
    // Reset form
    setFormData({
      nomorSurat: '',
      tanggalSurat: '',
      tanggalBerangkat: '',
      tanggalKembali: '',
      tujuanPerjalanan: '',
      lokasiPerjalanan: '',
      laporanHasil: '',
      nipPejabat: '',
      pejabatPemberiPerintah: '',
    });
    setPersonilList([{ nip: '', nama: '', jabatan: '', biayaTransport: 0, biayaUangSaku: 0, totalBiaya: 0 }]);
  };

  const handleCancel = () => {
    setFormData({
      nomorSurat: '',
      tanggalSurat: '',
      tanggalBerangkat: '',
      tanggalKembali: '',
      tujuanPerjalanan: '',
      lokasiPerjalanan: '',
      laporanHasil: '',
      nipPejabat: '',
      pejabatPemberiPerintah: '',
    });
    setPersonilList([{ nip: '', nama: '', jabatan: '', biayaTransport: 0, biayaUangSaku: 0, totalBiaya: 0 }]);
    onCancelEdit();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Surat *</label>
              <input
                type="date"
                required
                value={formData.tanggalSurat}
                onChange={(e) => setFormData({ ...formData, tanggalSurat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

        {/* Section 2: Personil (Multiple) */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">👤 Data Personil ({personilList.length} orang)</h3>
            <button
              type="button"
              onClick={handleAddPersonil}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Personil
            </button>
          </div>
          
          <div className="space-y-3">
            {personilList.map((personil, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Personil #{index + 1}
                  </span>
                  {personilList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePersonil(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                      title="Hapus personil"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">NIP *</label>
                    <input
                      type="text"
                      required
                      value={personil.nip}
                      onChange={(e) => handlePersonilChange(index, 'nip', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Nomor Induk Pegawai"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Personil *</label>
                    <input
                      type="text"
                      required
                      value={personil.nama}
                      onChange={(e) => handlePersonilChange(index, 'nama', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Jabatan *</label>
                    <input
                      type="text"
                      required
                      value={personil.jabatan}
                      onChange={(e) => handlePersonilChange(index, 'jabatan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Jabatan"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Biaya Transport (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={personil.biayaTransport || ''}
                      onChange={(e) => handlePersonilChange(index, 'biayaTransport', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Uang Saku (Rp)</label>
                    <input
                      type="number"
                      min="0"
                      value={personil.biayaUangSaku || ''}
                      onChange={(e) => handlePersonilChange(index, 'biayaUangSaku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                {personil.totalBiaya > 0 && (
                  <div className="mt-2 text-right">
                    <span className="text-xs text-gray-500">Total: </span>
                    <span className="text-sm font-bold text-green-700">{formatCurrency(personil.totalBiaya)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total biaya semua personil */}
          {totalBiayaKeseluruhan > 0 && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-medium text-green-700">💰 Total Biaya Seluruh Personil:</span>
              <span className="text-lg font-bold text-green-800">{formatCurrency(totalBiayaKeseluruhan)}</span>
            </div>
          )}
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

        {/* Section 4: Pejabat */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-blue-700 mb-4 uppercase tracking-wide">🏛️ Pejabat Pemberi Perintah</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIP Pejabat *</label>
              <input
                type="text"
                required
                value={formData.nipPejabat}
                onChange={(e) => setFormData({ ...formData, nipPejabat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nomor Induk Pegawai pejabat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama & Jabatan Pejabat *</label>
              <input
                type="text"
                required
                value={formData.pejabatPemberiPerintah}
                onChange={(e) => setFormData({ ...formData, pejabatPemberiPerintah: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nama dan jabatan pejabat pemberi perintah"
              />
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
