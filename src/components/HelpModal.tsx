import React, { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('penggunaan');

  if (!isOpen) return null;

  const sections = [
    { id: 'penggunaan', label: '📖 Cara Penggunaan', icon: '📖' },
    { id: 'database', label: '💾 Penyimpanan Data', icon: '💾' },
    { id: 'fitur', label: '✨ Fitur Utama', icon: '✨' },
    { id: 'tips', label: '💡 Tips', icon: '💡' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-xl">Panduan Penggunaan Aplikasi</h3>
              <p className="text-blue-100 text-sm">Pelajari cara menggunakan aplikasi ini</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-56 bg-gray-50 border-r border-gray-200 p-3 space-y-1 overflow-y-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection === 'penggunaan' && (
              <div className="space-y-5">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-2">🎯 Langkah-langkah Penggunaan</h4>
                  <p className="text-sm text-blue-700">
                    Aplikasi ini dirancang semudah mungkin untuk digunakan. Ikuti langkah berikut:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                      Buka Tab "Input Data"
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Secara otomatis aplikasi akan membuka tab Input Data. Di sini Anda bisa mulai memasukkan data perjalanan dinas.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                      Isi Informasi Surat & Waktu
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Masukkan <strong>Nomor Surat</strong>, <strong>Tanggal Berangkat</strong>, dan <strong>Tanggal Kembali</strong>. 
                      Lama perjalanan akan dihitung otomatis berdasarkan tanggal yang dimasukkan.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                      Tambahkan Data Personil
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Untuk setiap personil yang melakukan perjalanan dinas, masukkan:
                    </p>
                    <ul className="text-sm text-gray-600 mt-1 ml-4 list-disc space-y-1">
                      <li><strong>NIP</strong> - Nomor Induk Pegawai</li>
                      <li><strong>Nama Lengkap</strong></li>
                      <li><strong>Jabatan</strong></li>
                      <li><strong>Biaya Transport</strong> (dalam Rupiah)</li>
                      <li><strong>Uang Saku</strong> (dalam Rupiah)</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-2">
                      💡 Klik tombol <strong>"Tambah Personil"</strong> untuk menambah lebih dari satu orang dalam satu surat perintah.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                      Isi Detail Perjalanan
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Masukkan <strong>Tujuan Perjalanan</strong>, <strong>Lokasi</strong>, dan <strong>Laporan Hasil Pelaksanaan</strong>.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                      Isi Data Pejabat
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Masukkan <strong>NIP Pejabat</strong> dan <strong>Nama & Jabatan Pejabat</strong> yang memberi perintah perjalanan dinas.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h5 className="font-bold text-gray-800 flex items-center gap-2">
                      <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
                      Simpan Data
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Klik tombol <strong>"Simpan Data"</strong> untuk menyimpan. Data akan otomatis tersimpan di browser Anda.
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <h5 className="font-bold text-amber-800 mb-2">🔄 Mengedit & Menghapus Data</h5>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc ml-4">
                    <li>Klik ikon <strong>👁️ (mata)</strong> untuk melihat detail data</li>
                    <li>Klik ikon <strong>✏️ (pensil)</strong> untuk mengedit data</li>
                    <li>Klik ikon <strong>🗑️ (tempat sampah)</strong> untuk menghapus data</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'database' && (
              <div className="space-y-5">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">💾 Lokasi Penyimpanan Data</h4>
                  <p className="text-sm text-green-700">
                    Semua data perjalanan dinas tersimpan di <strong>LocalStorage Browser</strong> Anda.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">📍</span>
                      Apa itu LocalStorage?
                    </h5>
                    <p className="text-sm text-gray-600">
                      LocalStorage adalah fitur bawaan browser (Chrome, Firefox, Edge, Safari) yang memungkinkan 
                      aplikasi web menyimpan data secara lokal di perangkat Anda. Data ini:
                    </p>
                    <ul className="text-sm text-gray-600 mt-2 space-y-1 list-disc ml-4">
                      <li>Tersimpan di dalam browser yang Anda gunakan</li>
                      <li>Tidak dikirim ke server manapun</li>
                      <li>Tetap ada meskipun browser ditutup</li>
                      <li>Hanya bisa diakses dari browser dan perangkat yang sama</li>
                    </ul>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">🔑</span>
                      Kunci Penyimpanan (Storage Key)
                    </h5>
                    <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                      <span className="text-gray-500">Key:</span>{' '}
                      <span className="text-blue-600 font-bold">perjalanan_dinas_data</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Data disimpan dengan kunci <code className="bg-gray-100 px-1 rounded">perjalanan_dinas_data</code> di 
                      LocalStorage browser Anda.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      Kelebihan Penyimpanan Lokal
                    </h5>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc ml-4">
                      <li><strong>Cepat</strong> - Data langsung tersimpan tanpa koneksi internet</li>
                      <li><strong>Privasi</strong> - Data tidak dikirim ke server eksternal</li>
                      <li><strong>Offline</strong> - Bisa digunakan tanpa internet</li>
                      <li><strong>Permanen</strong> - Data tetap ada selama tidak dihapus</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h5 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      Hal yang Perlu Diperhatikan
                    </h5>
                    <ul className="text-sm text-red-700 space-y-2 list-disc ml-4">
                      <li>
                        <strong>Data hanya ada di browser ini</strong> - Jika Anda membuka aplikasi di browser lain 
                        atau perangkat lain, data tidak akan muncul.
                      </li>
                      <li>
                        <strong>Jangan hapus cache browser</strong> - Membersihkan cache/data browser akan 
                        menghapus semua data yang tersimpan.
                      </li>
                      <li>
                        <strong>Mode Incognito/Private</strong> - Data di mode ini akan hilang saat browser ditutup.
                      </li>
                      <li>
                        <strong>Rutin backup</strong> - Gunakan fitur <strong>"Export Excel"</strong> untuk membuat 
                        cadangan data secara berkala.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      Cara Backup Data
                    </h5>
                    <ol className="text-sm text-blue-700 space-y-2 list-decimal ml-4">
                      <li>Buka tab <strong>"Data Perjalanan"</strong> atau <strong>"Rekapitulasi"</strong></li>
                      <li>Klik tombol <strong>"Export Excel"</strong> berwarna hijau</li>
                      <li>File Excel akan terunduh otomatis ke folder Download</li>
                      <li>Simpan file tersebut sebagai cadangan data Anda</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'fitur' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5">
                    <div className="text-3xl mb-2">📝</div>
                    <h5 className="font-bold mb-1">Input Data</h5>
                    <p className="text-sm text-blue-100">
                      Form lengkap untuk mencatat data perjalanan dinas dengan dukungan multi-personil.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-5">
                    <div className="text-3xl mb-2">📊</div>
                    <h5 className="font-bold mb-1">Data Perjalanan</h5>
                    <p className="text-sm text-green-100">
                      Tabel data lengkap dengan fitur pencarian, edit, hapus, dan lihat detail.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5">
                    <div className="text-3xl mb-2">📋</div>
                    <h5 className="font-bold mb-1">Rekapitulasi</h5>
                    <p className="text-sm text-purple-100">
                      Dashboard statistik dengan analisis per lokasi, per personil, dan rincian biaya.
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-5">
                    <div className="text-3xl mb-2">📥</div>
                    <h5 className="font-bold mb-1">Export Excel</h5>
                    <p className="text-sm text-amber-100">
                      Unduh data dalam format Excel (.xlsx) dengan multi-sheet untuk backup.
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <h5 className="font-bold text-gray-800 mb-3">🎯 Fitur Detail</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Perhitungan otomatis lama perjalanan</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Dukungan multi-personil per surat</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Pencarian berdasarkan NIP/Nama/Lokasi</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Filter rekap per bulan & tahun</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Rekap biaya per lokasi & personil</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Format mata uang Rupiah otomatis</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Tampilan responsif (desktop & mobile)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Penyimpanan otomatis di browser</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'tips' && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-bold text-amber-800 mb-2">💡 Tips Penggunaan</h4>
                  <p className="text-sm text-amber-700">
                    Berikut beberapa tips untuk menggunakan aplikasi dengan optimal:
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">🔄 Rutin Backup Data</h5>
                    <p className="text-sm text-gray-600">
                      Lakukan export Excel minimal seminggu sekali untuk menghindari kehilangan data 
                      jika browser tidak sengaja di-clear.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">🔍 Gunakan Fitur Pencarian</h5>
                    <p className="text-sm text-gray-600">
                      Anda bisa mencari data berdasarkan NIP, nama personil, lokasi, nomor surat, 
                      atau nama pejabat. Cukup ketik kata kunci di kolom pencarian.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">📊 Manfaatkan Rekapitulasi</h5>
                    <p className="text-sm text-gray-600">
                      Gunakan filter bulan dan tahun di halaman Rekapitulasi untuk melihat data 
                      pada periode tertentu. Berguna untuk laporan bulanan/tahunan.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">👥 Multi-Personil Efisien</h5>
                    <p className="text-sm text-gray-600">
                      Jika ada beberapa orang yang melakukan perjalanan dinas dengan surat yang sama, 
                      gunakan fitur "Tambah Personil" untuk memasukkan semua data sekaligus.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">🌐 Gunakan Browser yang Sama</h5>
                    <p className="text-sm text-gray-600">
                      Selalu gunakan browser yang sama untuk mengakses aplikasi agar data tetap tersimpan. 
                      Jangan gunakan mode Incognito/Private.
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">📱 Bisa di HP/Tablet</h5>
                    <p className="text-sm text-gray-600">
                      Aplikasi ini responsif dan bisa digunakan di perangkat mobile. Namun untuk 
                      pengalaman terbaik, disarankan menggunakan laptop/komputer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            📌 Data tersimpan di LocalStorage browser dengan key: <code className="bg-gray-200 px-1 rounded">perjalanan_dinas_data</code>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
