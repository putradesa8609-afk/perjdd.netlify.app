export interface PerjalananDinas {
  id: string;
  nomorSurat: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  namaPersonil: string;
  jabatanPersonil: string;
  tujuanPerjalanan: string;
  lokasiPerjalanan: string;
  lamaPerjalanan: number;
  laporanHasil: string;
  pejabatPemberiPerintah: string;
  biayaTransport: number;
  biayaUangSaku: number;
  totalBiaya: number;
  createdAt: string;
}
