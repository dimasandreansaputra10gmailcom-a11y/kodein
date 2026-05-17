export interface StageInfo {
  id: string;
  title: string;
  zone: string;
  material: string;
  quest: string;
}

export const ADVENTURE_STAGES: Record<string, StageInfo[]> = {
  sd: [
    { id: '1', title: 'Algoritma Harian', zone: 'Desa Pemula', material: 'Mencuci tangan & sepatu', quest: 'Menyusun langkah harian' },
    { id: '2', title: 'Arah & Navigasi', zone: 'Hutan Arah', material: 'Maju, Kiri, Kanan', quest: 'Mencari jalan keluar' },
    { id: '3', title: 'Pengenalan Sprite', zone: 'Taman Bermain', material: 'Animasi Karakter', quest: 'Menggerakkan karakter di layar' },
    { id: '4', title: 'Sequencing', zone: 'Gua Berurutan', material: 'Kode Berurutan', quest: 'Turun ke dasar gua' },
    { id: '5', title: 'Loops & Conditionals', zone: 'Menara SD', material: 'IF dan Repeat', quest: 'Menaklukkan tantangan logis' },
  ],
  smp: [
    { id: '1', title: 'Dasar HTML & CSS', zone: 'Desa Pemula (The Starter Village)', material: 'Sintaks Dasar & Konsep Tag', quest: 'Membangun Basecamp Karakter' },
    { id: '2', title: 'Variabel & Tipe Data', zone: 'Hutan Variabel (Forest of Data)', material: 'Data & Memori Komputer', quest: 'Membuat Sistem Inventori' },
    { id: '3', title: 'Logika Kondisional', zone: 'Gua Percabangan (Cave of Choices)', material: 'Percabangan IF/ELSE', quest: 'Menjawab Teka-teki Penjaga Pintu' },
    { id: '4', title: 'Loops (FOR & WHILE)', zone: 'Labirin Perulangan (Looping Labyrinth)', material: 'Iterasi & Efisiensi', quest: 'Farming Koin Otomatis' },
    { id: '5', title: 'Fungsi & Integrasi', zone: 'Menara KODE.in (The Final Boss)', material: 'Modularitas Program', quest: 'Game Petualangan Teks Sederhana' },
  ],
  sma: [
    { id: '1', title: 'Logika Lanjut & Menu', zone: 'Kamp Pelatihan Sintaks', material: 'C/Java, Switch-case', quest: 'Membuat Sistem Menu Utama Terminal' },
    { id: '2', title: 'Dasar Database', zone: 'Kuil Relasional', material: 'Struktur Data & CRUD', quest: 'Mendesain Skema Data Karakter' },
    { id: '3', title: 'Pengenalan API & JSON', zone: 'Jembatan Integrasi', material: 'Client-Server Communication', quest: 'Menarik Data dari Server' },
    { id: '4', title: 'Manajemen Akun', zone: 'Benteng Otentikasi', material: 'Otentikasi & Otorisasi', quest: 'Membangun Gerbang Login Aman' },
    { id: '5', title: 'Integrasi Back-End Penuh', zone: 'Inti Server (The Server Core)', material: 'Arsitektur Terpadu', quest: 'Membangun Sistem Penilaian (Judge System)' },
  ],
  pt: [
    { id: '1', title: 'Matematika Diskrit', zone: 'Lembah Fondasi Logika', material: 'Kalkulus Algoritmik', quest: 'Merancang Algoritma Skalabilitas Data' },
    { id: '2', title: 'Organisasi Komputer', zone: 'Reruntuhan Mesin Kuno', material: 'Pemrosesan Biner', quest: 'Mengoptimalkan Siklus Instruksi' },
    { id: '3', title: 'Java & Supabase', zone: 'Kota Basis Data Awan', material: 'Cloud DB & Arsitektur', quest: 'Membangun Infrastruktur API' },
    { id: '4', title: 'Integrasi AI (Gemini API)', zone: 'Kuil Pengetahuan Buatan', material: 'Rekayasa Sistem Cerdas', quest: 'Mengembangkan Asisten Pintar' },
    { id: '5', title: 'System Deployment', zone: 'Puncak Rekayasa Sistem', material: 'Sistem Terdistribusi', quest: 'Mendeploy Infrastruktur EdTech Terpadu' },
  ],
};
