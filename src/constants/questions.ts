export const QUESTIONS = {
  // DUNIA 1 - LOGIC LAND
  1: [
    {
      "id": "L1Q1", "type": "multiple_choice",
      "question": "Apa yang dilakukan komputer saat kamu menekan tombol on/off?",
      "options": ["A. Tidur", "B. Mulai bekerja / menyala", "C. Bermain game", "D. Makan listrik saja"],
      "answer": "B", "explanation": "Menekan tombol power memberikan sinyal kepada komputer untuk memulai proses booting!"
    },
    {
      "id": "L1Q2", "type": "multiple_choice",
      "question": "Mana yang merupakan contoh perangkat OUTPUT?",
      "options": ["A. Keyboard", "B. Mouse", "C. Monitor", "D. Kamera"],
      "answer": "C", "explanation": "Monitor menampilkan hasil kerja komputer — itu adalah output yang bisa kamu lihat!"
    },
    {
      "id": "L1Q3", "type": "true_false",
      "question": "Program komputer adalah kumpulan instruksi yang diberikan kepada komputer.",
      "answer": "true", "explanation": "Tepat! Program = sekumpulan perintah yang dibaca komputer dari atas ke bawah."
    },
    {
      "id": "L1Q4", "type": "multiple_choice",
      "question": "Urutan langkah untuk membuat sandwich adalah contoh dari…",
      "options": ["A. Bug", "B. Algoritma", "C. Error", "D. Virus"],
      "answer": "B", "explanation": "Algoritma adalah urutan langkah-langkah untuk menyelesaikan masalah — persis seperti resep!"
    },
    {
      "id": "L1Q5", "type": "fill_blank",
      "question": "Komputer memproses ______ (masukan) dan menghasilkan ______ (keluaran).",
      "answer": ["input", "output"], "explanation": "Siklus dasar komputer: INPUT → PROSES → OUTPUT."
    }
  ],
  2: [
    {
      "id": "L2Q1", "type": "multiple_choice",
      "question": "Kamu mau mencetak 'Halo' sebanyak 5 kali. Cara paling efisien adalah…",
      "options": ["A. Ketik 'Halo' 5 kali manual", "B. Gunakan perulangan (loop)", "C. Copy-paste 5 kali", "D. Minta teman mengetiknya"],
      "answer": "B", "explanation": "Loop memungkinkan kita mengulang instruksi tanpa menulis kode berulang-ulang!"
    },
    {
      "id": "L2Q2", "type": "code_output",
      "question": "Berapa kali kata 'Kode' dicetak?\n\nfor i in range(4):\n    print('Kode')",
      "options": ["A. 3 kali", "B. 4 kali", "C. 5 kali", "D. Tidak dicetak sama sekali"],
      "answer": "B", "explanation": "range(4) menghasilkan angka 0,1,2,3 — 4 angka, jadi 4 kali iterasi!"
    }
  ]
};
