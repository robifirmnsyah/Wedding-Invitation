import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { addWish } from "../src/lib/wishesStore";

const dummyWishes = [
  { name: "Budi Santoso", message: "Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.", attendance: "hadir" },
  { name: "Ani Yudhoyono", message: "Happy wedding yaa! Lancar sampai hari H dan bahagia selalu.", attendance: "hadir" },
  { name: "Citra Kirana", message: "Wah selamat ya! Maaf banget belum bisa hadir, semoga acaranya lancar.", attendance: "tidak_hadir" },
  { name: "Deni Sumargo", message: "Congrats bro! Akhirnya melepas masa lajang. Doa terbaik buat kalian berdua.", attendance: "hadir" },
  { name: "Eka Wardhani", message: "Selamat berbahagia! Semoga cinta kalian abadi selamanya.", attendance: "hadir" },
  { name: "Fajar Nugraha", message: "Barakallah laka wa baraka alaika wa jamaa bainakuma fii khair. Selamat ya!", attendance: "hadir" },
  { name: "Gita Savitri", message: "Happy for both of you! Wishing you a lifetime of love and happiness.", attendance: "ragu" },
  { name: "Hendra Wijaya", message: "Selamat bro, semoga lancar persiapannya dan jadi keluarga bahagia.", attendance: "hadir" },
  { name: "Iwan Fals", message: "Selamat ya, semoga langgeng sampai kakek nenek.", attendance: "hadir" },
  { name: "Joko Anwar", message: "Selamat menempuh lembaran baru! Semoga dipenuhi kebahagiaan.", attendance: "tidak_hadir" },
  { name: "Kartika Putri", message: "Alhamdulillah, selamat yaa! Semoga menjadi pasangan sehidup semati.", attendance: "hadir" },
  { name: "Lestari Ayu", message: "Happy wedding! Maaf ngga bisa dateng karena lagi di luar kota, doa terbaik pokoknya.", attendance: "tidak_hadir" },
  { name: "Muhammad Ilham", message: "Selamat menempuh hidup baru, semoga dilancarkan segala urusannya.", attendance: "ragu" },
  { name: "Nadia Vega", message: "Selamat berbahagia untuk kalian berdua! Semoga selalu dilimpahi rezeki dan kebahagiaan.", attendance: "hadir" },
  { name: "Oka Antara", message: "Congrats! Selamat menikmati indahnya rumah tangga.", attendance: "hadir" },
  { name: "Putri Titian", message: "Selamat ya! Semoga jadi keluarga yang hangat dan selalu diberkahi.", attendance: "hadir" },
  { name: "Qori Amelia", message: "Barakallah, selamat menempuh hidup baru. Semoga samawa ya!", attendance: "hadir" },
  { name: "Reza Rahadian", message: "Happy wedding! Wishing you all the best for today and beyond.", attendance: "ragu" },
  { name: "Siska Saraswati", message: "Selamat yaa! Senang banget denger kabarnya, semoga lancar sampai hari H.", attendance: "hadir" },
  { name: "Toni Haryanto", message: "Selamat bro! Semoga rumah tangganya selalu diberkahi Tuhan.", attendance: "hadir" }
];

async function seed() {
  console.log("Memulai injeksi 20 data wish dummy...");
  
  for (const wish of dummyWishes) {
    try {
      await addWish({
        name: wish.name,
        message: wish.message,
        attendance: wish.attendance as any,
        verified: false
      });
      console.log(`✅ Berhasil menambahkan ucapan dari: ${wish.name}`);
      
      // Kasih jeda sedikit biar ngga kena rate limit dari Google API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Gagal menambahkan ucapan dari: ${wish.name}`, error);
    }
  }
  
  console.log("✅ Injeksi data selesai!");
}

seed();
