import React, { useEffect } from 'react';
import { motion, useMotionValue, animate, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import Container from './Layout/Container';

export default function SwipeToBackWrapper({ children, onBack }) {
  const width = window.innerWidth;
  
  // Motion value menyimpan posisi geseran (X) tanpa memicu React re-render
  const x = useMotionValue(0);

  // Efek meredupkan cahaya hitam/bayangan ala iOS saat digeser
  // Semakin digeser ke kanan (X membesar), bayangan semakin hilang
  const overlayOpacity = useTransform(x, [0, width], [0.3, 0]);

  // Handle logika drag (geser)
  const bind = useDrag(({ movement: [mx], vxvy: [vx], down, cancel, first, initial: [startX] }) => {
    
    // ATURAN 1: iOS Edge Swipe - hanya izinkan swipe jika dimulai dari tepi kiri layar (misal < 40px)
    if (first && startX > 40) {
      cancel();
      return;
    }

    if (down) {
      // Saat layar ditahan/digeser: Halaman mengikuti koordinat jari
      // Memaksa X tidak bisa bernilai negatif (tidak bisa geser ke kiri)
      x.set(Math.max(0, mx));
    } else {
      // Saat jari dilepas: Cek apakah user sudah menggeser cukup jauh (threshold 30%)
      // ATAU swipe berlangsung sangat cepat (velocity X (vx) > 0.5)
      if (mx > width * 0.3 || vx > 0.5) {
        // Transisi lolos: Lanjutkan animasi halaman terlempar ke luar layar
        animate(x, width, {
          type: "spring",
          stiffness: 300,
          damping: 30,
          onComplete: () => {
            if (onBack) onBack(); // Panggil fungsi router navigasi (-1)
          }
        });
      } else {
        // Transisi gagal: Halaman otomatis memantul kembali ke posisi nol
        animate(x, 0, { 
          type: "spring", 
          stiffness: 400, 
          damping: 40 
        });
      }
    }
  }, {
    axis: 'x', // Kita hanya mendeteksi geseran horizontal
    pointer: { touch: true }
  });

  return (
    <>
      {/* Efek gelap/dimming untuk halaman di bawahnya (khas iOS) */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="fixed inset-0 bg-black z-40 pointer-events-none"
      />

      {/* Kontainer halaman utama yang bisa digeser */}
      <motion.div
        {...bind()}
        style={{
          x,
          boxShadow: '-10px 0 30px rgba(0,0,0,0.15)', // Shadow tepi layar
        }}
        className="fixed top-0 left-0 right-0 mx-auto max-w-6xl h-full bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] dark:from-[#0f172a] dark:to-[#020617] z-50 overflow-x-hidden overflow-y-auto touch-pan-y shadow-2xl sm:border-x border-slate-200/50 dark:border-slate-800/50"
      >
        {/* Decorative Background Elements to smoothly match the underlying layout */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-100/60 to-transparent dark:from-emerald-900/20 z-0 pointer-events-none"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 -left-32 w-80 h-80 bg-amber-300/20 dark:bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none flex" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15L15 15zM0 30l15 15-15 15L0 45zm60 0l-15 15 15 15V30zM30 60l15-15-15-15-15 15z' fill='%23059669' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`}}>
        </div>
        
        {/* Main Content utilizing unified Container constraints */}
        <Container className="relative z-10 pt-12 min-h-screen">
          {children}
        </Container>
      </motion.div>
    </>
  );
}
