export interface Personil {
  nip: string;
  nama: string;
  jabatan: string;
  biayaTransport: number;
  biayaUangSaku: number;
  totalBiaya: number;
}

export interface PerjalananDinas {
  id: string;
  nomorSurat: string;
  tanggalSurat: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  tujuanPerjalanan: string;
  lokasiPerjalanan: string;
  lamaPerjalanan: number;
  laporanHasil: string;
  nipPejabat: string;
  pejabatPemberiPerintah: string;
  personil: Personil[];
  totalBiayaKeseluruhan: number;
  createdAt: string;
}
