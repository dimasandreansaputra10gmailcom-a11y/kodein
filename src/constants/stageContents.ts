export interface Quiz {
  question: string;
  options: string[];
  correct: number;
}

export interface StageContent {
  title: string;
  theory: string;
  quizzes: Quiz[];
  codeInstruction: string;
  expectedCode: string;
}

// Generate base content function to fallback when specific content is missing
const generateBaseContent = (title: string, material: string, quest: string): StageContent => ({
  title: `Stage: ${title}`,
  theory: `Selamat datang di ${title}!\n\nDi sini kita akan belajar materi utama: ${material}.\nMisi utama kamu adalah: ${quest}.\n\nKonsep ini sangat penting agar kita bisa melanjutkan perjalanan di dunia KODE.in!`,
  quizzes: [
    {
      question: `Apa misi utama kita di stage ini?`,
      options: ["Tidur", quest, "Bermain game", "Tidak ada"],
      correct: 1
    },
    {
      question: `Materi utama yang kita pelajari adalah?`,
      options: ["Memancing", "Menggambar", material, "Bernyanyi"],
      correct: 2
    }
  ],
  codeInstruction: `Tuliskan kembali nama misi kita ("${quest}") ke dalam console.log!`,
  expectedCode: `console.log("${quest}")`
});

export const STAGE_CONTENTS: Record<string, Record<string, StageContent>> = {
  sd: {
    '1': generateBaseContent("Lembah Algoritma Harian", "Pemahaman Urutan & Logika Keseharian", "Menyusun langkah harian"),
    '2': generateBaseContent("Hutan Arah Navigasi", "Maju, Mundur, Belok Kiri, Belok Kanan", "Mencari jalan keluar labirin"),
    '3': generateBaseContent("Taman Bermain Sprite", "Menggerakkan Objek dengan Kode", "Menggerakkan karakter di layar"),
    '4': generateBaseContent("Gua Berurutan", "Sequencing & Algoritma Lanjut", "Turun ke dasar gua dengan urutan yang tepat"),
    '5': generateBaseContent("Menara SD", "Loops (Perulangan) & Conditionals", "Menghadapi tantangan logis terakhir"),
  },
  smp: {
    '1': {
      title: "Desa Pemula (The Starter Village)",
      theory: "Siswa memulai petualangan mereka dengan mempelajari cara membangun tampilan visual. Di sini mereka belajar bahwa setiap elemen di dunia digital memiliki struktur dan gaya.\n\nKonsep Komputasional: Struktur dokumen dan sintaksis dasar.\n\nMateri:\n- Pengenalan tag HTML dasar (Heading, Paragraf, Gambar).\n- Mewarnai dan mengatur tata letak dasar menggunakan CSS.",
      quizzes: [
        { question: "Bahasa apakah yang digunakan untuk mengatur tata letak dan gaya pada web?", options: ["Java", "HTML", "CSS", "Python"], correct: 2 },
        { question: "Tag HTML apa yang digunakan untuk membuat paragraf?", options: ["<h1>", "<p>", "<img>", "<div>"], correct: 1 }
      ],
      codeInstruction: "Quest: Membangun Basecamp. Siswa diminta menulis kode HTML dasar. Lengkapi kode ini: <___>Halo Dunia!</___>",
      expectedCode: "p"
    },
    '2': generateBaseContent("Hutan Variabel (Forest of Data)", "Variabel & Tipe Data (Python/JS)", "Membuat Sistem Inventori"),
    '3': generateBaseContent("Gua Percabangan (Cave of Choices)", "Logika Kondisional (IF/ELSE)", "Menjawab Teka-teki Penjaga Pintu"),
    '4': generateBaseContent("Labirin Perulangan (Looping Labyrinth)", "Loops (FOR & WHILE)", "Farming Koin Otomatis"),
    '5': generateBaseContent("Menara KODE.in (The Final Boss)", "Fungsi & Integrasi", "Game Petualangan Teks Sederhana"),
  },
  sma: {
    '1': {
      title: "Kamp Pelatihan Sintaks (Syntax Bootcamp)",
      theory: "Siswa memasuki kamp pelatihan untuk memantapkan logika pemrograman tingkat lanjut menggunakan bahasa seperti C atau Java. Fokusnya adalah pada alur kontrol yang ketat dan pembuatan program interaktif yang solid.\n\nKonsep Komputasional: Switch-case, fungsi tingkat lanjut, dan penanganan input pengguna.\n\nMateri:\n- Struktur program C/Java.\n- Membuat menu interaktif di terminal.\n- Validasi input sistem.",
      quizzes: [
        { question: "Opsi kontrol alur mana yang paling cocok untuk membuat sebuah menu pilihan ganda?", options: ["if-else berantai", "Switch-case", "For Loop", "While loop"], correct: 1 },
        { question: "Mengapa kita membutuhkan validasi input sistem?", options: ["Agar program terlihat panjang", "Untuk menjaga program dari input error atau tidak valid", "Untuk mengurangi kinerja memori", "Mempercantik warna teks"], correct: 1 }
      ],
      codeInstruction: "Quest: Navigasi Markas. Pilih opsi 4 pada perintah Switch berikut: \nswitch(pilihan) {\n  case ___:\n    exit(0);\n}",
      expectedCode: "4"
    },
    '2': generateBaseContent("Kuil Relasional (Temple of Relations)", "Dasar Database & Struktur Data", "Mendesain Skema Data Karakter"),
    '3': generateBaseContent("Jembatan Integrasi (The API Bridge)", "Pengenalan API & JSON", "Menarik Data dari Server"),
    '4': generateBaseContent("Benteng Otentikasi (Fortress of Auth)", "Manajemen Akun Pengguna", "Membangun Gerbang Login Aman"),
    '5': generateBaseContent("Inti Server (The Server Core)", "Integrasi Back-End Penuh", "Membangun Sistem Penilaian (Judge System)"),
  },
  pt: {
    '1': {
      title: "Lembah Fondasi Logika (Valley of Logic)",
      theory: "Petualang tingkat tinggi harus memahami bahwa ilmu komputer berakar kuat pada matematika murni. Di lembah ini, mahasiswa mematangkan logika pemecahan masalah teoritis sebelum menyentuh kode aplikasi.\n\nKonsep Komputasional:\nKompleksitas algoritma (Big O Notation), optimasi fungsi, dan logika proposisional.\n\nMateri:\n- Penerapan Matematika Diskrit untuk memahami struktur data kompleks (Graf, Tree, State Machines).\n- Penggunaan Kalkulus dasar untuk analisis fungsi algoritma dan optimasi machine learning.",
      quizzes: [
        { question: "Apa tujuan utama dari Big O Notation?", options: ["Membuat variabel baru", "Mengukur kompleksitas dan efisiensi algoritma", "Mencetak output ke layar", "Mendeklarasikan database"], correct: 1 },
        { question: "Cabang matematika apa yang esensial untuk memahami Graf dan Tree?", options: ["Geometri", "Aritmatika", "Matematika Diskrit", "Aljabar Linear"], correct: 2 }
      ],
      codeInstruction: "Quest: Menjinakkan Arus Data. Ketikkan nama konsep mengukur performa (Big ___ Notation)!",
      expectedCode: "O"
    },
    '2': {
      title: "Reruntuhan Mesin Kuno (Ruins of the Machine)",
      theory: "Sebelum membangun sistem berskala besar, mahasiswa harus paham struktur dasar komputasinya. Memahami bagaimana perangkat lunak berinteraksi langsung dengan fisik mesin adalah kunci dari performa aplikasi.\n\nKonsep Komputasional: Pemrosesan instruksi pada level perangkat keras.\n\nMateri:\n- Organisasi Komputer (ALU, Control Unit, Cache).\n- Representasi data biner, heksadesimal, manipulasi bitwise.",
      quizzes: [
        { question: "Bagian CPU manakah yang bertanggung jawab melakukan perhitungan aritmatika?", options: ["Register", "ALU", "Control Unit", "RAM"], correct: 1 },
        { question: "Representasi data yang hanya menggunakan angka 0 dan 1 disebut?", options: ["Desimal", "Heksadesimal", "Biner", "Oktal"], correct: 2 }
      ],
      codeInstruction: "Quest: Mengoptimalkan Instruction Cycle. Tulis unit yang mengeksekusi aritmatika (singkatan 3 huruf)!",
      expectedCode: "ALU"
    },
    '3': {
      title: "Kota Basis Data Awan (Cloud Database City)",
      theory: "Petualang kini tiba di peradaban modern. Fokus utama di tahap ini adalah skalabilitas dan infrastruktur internet, beralih dari eksperimen lokal ke manajemen arsitektur Back-End yang sesungguhnya.\n\nKonsep: Arsitektur Server dan BaaS (Backend-as-a-Service).\n\nMateri:\n- Penerapan logika business layer menggunakan Java.\n- Integrasi Supabase secara dinamis.\n- Row Level Security (RLS) dan manajemen User Account.",
      quizzes: [
        { question: "Apa kepanjangan dari BaaS?", options: ["Base as a Service", "Background as a System", "Backend as a Service", "Bootstrap as a Service"], correct: 2 },
        { question: "Fitur keamanan Supabase yang membatasi akses pada level baris dinamakan?", options: ["Col-Level Security", "Table Security", "Row Level Security (RLS)", "Endpoint Auth"], correct: 2 }
      ],
      codeInstruction: "Quest: Membangun Infrastruktur API. Tuliskan nama ekosistem backend yang digunakan (Supa___)",
      expectedCode: "base"
    },
    '4': {
      title: "Kuil Pengetahuan Buatan (Temple of Artificial Knowledge)",
      theory: "Masa depan rekayasa perangkat lunak bertumpu pada AI. Di kuil ini, sistem tidak lagi statis, melainkan dapat memproses bahasa natural secara dinamis.\n\nKonsep: Rekayasa Sistem Cerdas & Generative AI.\n\nMateri:\n- Integrasi Google AI Studio (Gemini API).\n- Prompt engineering terstruktur.",
      quizzes: [
        { question: "API apa yang kita integrasikan untuk membuat Asisten Pintar pada quest ini?", options: ["Map API", "Payment API", "Gemini API", "Weather API"], correct: 2 },
        { question: "Teknik menyusun pertanyaan ke AI agar hasilnya terstruktur disebut?", options: ["Prompt Engineering", "Data Scraping", "Machine Learning", "System Call"], correct: 0 }
      ],
      codeInstruction: "Ketik nama API kecerdasan buatan Google yang kita pelajari (______ API)",
      expectedCode: "Gemini"
    },
    '5': {
      title: "Puncak Rekayasa Sistem (Peak of Software Engineering)",
      theory: "Ujian terakhir untuk membuktikan kompetensi sebagai Back-End Developer. Semua ilmu digabungkan ke dalam satu produk ekosistem yang utuh.\n\nKonsep: Arsitektur Sistem Terdistribusi.\n\nQuest: Menjalankan Ekosistem EdTech. Merilis versi arsitektur back-end lengkap, membuktikan seluruh aliran data dan AI berjalan stabil.",
      quizzes: [
        { question: "Apa tujuan akhir dari seluruh materi di level Perguruan Tinggi ini?", options: ["Membuat game 2D", "Menjadi Front-End", "Mendeploy infrastruktur EdTech lengkap dengan Judge System & AI", "Membuat 1 file HTML"], correct: 2 },
        { question: "Sistem yang bertugas mengevaluasi otomatis kode disebut?", options: ["Auth System", "Judge System", "Chat System", "Billing System"], correct: 1 }
      ],
      codeInstruction: "Ketik kata 'Deploy' untuk menyelesaikan!",
      expectedCode: "Deploy"
    }
  }
};
