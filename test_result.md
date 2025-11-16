#====================================================================================================
# MULAI - Protokol Pengujian - JANGAN EDIT ATAU HAPUS BAGIAN INI = AUTH ( NAUFALNYAA )
#====================================================================================================

# BAGIAN INI BERISI INSTRUKSI PENGUJIAN KRITIS UNTUK KEDUA AGEN
# BAIK MAIN_AGENT MAUPUN TESTING_AGENT HARUS MEMPERTAHANKAN BLOK INI SEPENUHNYA

# Protokol Komunikasi:
# Jika `testing_agent` tersedia, main agent harus menyerahkan semua tugas pengujian kepadanya.
#
# Anda memiliki akses ke file bernama `test_result.md`. File ini berisi seluruh status dan riwayat
# pengujian, dan merupakan media komunikasi utama antara main agent dan testing agent.
#
# Main agent dan testing agent **harus** mengikuti format ini untuk menjaga data pengujian.
# Data pengujian harus ditulis dalam format YAML sesuai struktur berikut:
#
## user_problem_statement: {penjelasan_masalah_user}
## backend:
##   - task: "Nama Task"
##     implemented: true
##     working: true  # atau false atau "NA"
##     file: "path_file.py"
##     stuck_count: 0
##     priority: "high"  # atau "medium" atau "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # atau false atau "NA"
##         -agent: "main"  # atau "testing" atau "user"
##         -comment: "Komentar detail mengenai status"
##
## frontend:
##   - task: "Nama Task"
##     implemented: true
##     working: true  # atau false atau "NA"
##     file: "path_file.js"
##     stuck_count: 0
##     priority: "high"  # atau "medium" atau "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # atau false atau "NA"
##         -agent: "main"  # atau "testing" atau "user"
##         -comment: "Komentar detail mengenai status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Nama Task 1"
##     - "Nama Task 2"
##   stuck_tasks:
##     - "Task yang mengalami masalah berulang"
##   test_all: false
##   test_priority: "high_first"  # atau "sequential" atau "stuck_first"
##
## agent_communication:
##     -agent: "main"  # atau "testing" atau "user"
##     -message: "Pesan komunikasi antar agen"

# Panduan untuk Main Agent
#
# 1. Update File Test Sebelum Pengujian:
#    - Main agent wajib mengupdate file `test_result.md` sebelum memanggil testing agent
#    - Tambahkan detail implementasi ke status_history
#    - Set `needs_retesting` menjadi true pada task yang perlu diuji ulang
#    - Update bagian `test_plan` untuk mengatur prioritas pengujian
#    - Tambahkan pesan ke agent_communication untuk menjelaskan apa yang telah dilakukan
#
# 2. Menggabungkan Feedback User:
#    - Jika user memberikan feedback bahwa suatu fitur berfungsi atau tidak berfungsi,
#      tambahkan informasi itu ke status_history task terkait
#    - Update status working berdasarkan laporan user
#    - Bila user melaporkan error pada task yang sebelumnya dianggap berfungsi,
#      increment nilai stuck_count
#    - Setiap kali user melaporkan bug, dan test_result.md tersedia,
#      temukan task terkait dan tambahkan catatan masalah user ke status_history
#
# 3. Melacak Task yang Bermasalah:
#    - Pantau task dengan stuck_count tinggi atau task yang masalahnya berulang
#    - Untuk masalah yang terus berulang, main agent boleh menggunakan websearch untuk mencari solusi
#    - Beri perhatian khusus pada task di daftar stuck_tasks
#    - Jika Anda memperbaiki issue task yang termasuk stuck_tasks,
#      jangan reset stuck_count sampai testing agent mengonfirmasi task tersebut sudah berfungsi
#
# 4. Beri Konteks ke Testing Agent:
#    - Saat memanggil testing agent, sertakan instruksi jelas mengenai:
#      - Task apa yang harus diuji (mengacu pada test_plan)
#      - Detail konfigurasi atau autentikasi bila diperlukan
#      - Skenario testing yang harus difokuskan
#      - Bug yang sudah diketahui atau edge-case
#
# 5. Selalu panggil testing agent dengan instruksi spesifik berdasarkan test_result.md
#
# PENTING: Main agent **HARUS** selalu update test_result.md **SEBELUM** memanggil testing agent,
# karena testing agent bergantung pada file tersebut untuk memahami apa yang harus diuji.
#
#====================================================================================================
# SELESAI - Protokol Pengujian - JANGAN EDIT ATAU HAPUS BAGIAN INI
#====================================================================================================



#====================================================================================================
# Data Pengujian - Main Agent dan Testing Agent harus mencatat data pengujian di bawah bagian ini
#====================================================================================================
