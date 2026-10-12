export interface Personil {
  nama: string;
  jabatan: string;
  biayaTransport: number;
  biayaUangSaku: number;
  totalBiaya: number;
}

export interface PerjalananDinas {
  id: string;
  nomorSurat: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  tujuanPerjalanan: string;
  lokasiPerjalanan: string;
  lamaPerjalanan: number;
  laporanHasil: string;
  pejabatPemberiPerintah: string;
  personil: Personil[];
  totalBiayaKeseluruhan: number;
  createdAt: string;
}
