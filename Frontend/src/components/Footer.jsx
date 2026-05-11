import backgroundfooter from '../assets/background maps.jpg';

export default function Footer() {
  return (
    <footer id="contact">
      {/* Contact Section */}
      <section className="relative">
        {/* Background image */}
        <img
          src={backgroundfooter}
          alt="cafe background"
          className="w-full h-[420px] object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 flex flex-col px-8 md:px-16 py-8">

          {/* Judul tengah atas */}
          <h2 className="text-white text-3xl font-bold font-serif italic text-center mb-8">
            Our Contact
          </h2>

          {/* Konten: kiri info, kanan peta — sejajar vertikal */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 flex-1">

            {/* Kiri: Info Kontak */}
            <div className="text-white space-y-5 flex flex-col justify-center flex-1">

              {/* Alamat */}
              <div className="flex items-start gap-3 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.458-7.5 11.458s-7.5-4.316-7.5-11.458a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="leading-relaxed">
                  Jl. Pertengahan No.7, RT.6/RW.7, Cijantung, Kec. Ps. Rebo,<br />
                  Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13770
                </span>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <a
                  href="https://www.instagram.com/nawa.everyday?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-yellow-300 transition-colors"
                >
                  Nawa Everyday
                </a>
              </div>

              {/* TikTok */}
              <div className="flex items-center gap-3 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
                  <a
                  href="https://www.tiktok.com/@nawa.everyday?is_from_webapp=1&sender_device=pc"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-yellow-300 transition-colors"
                >
                  Nawa Everyday
                </a>
              </div>

            </div>

            {/* Kanan: Google Maps — tinggi mengikuti sisa ruang */}
            <div className="rounded-2xl overflow-hidden shadow-xl w-full md:w-[45%] flex-1 min-h-[200px]">
              <iframe
                title="Nawa Everyday Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5263796100644!2d106.8562008!3d-6.3257609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed80e65f219f%3A0xaf8d286b8edfd7ad!2sNawa%20Everyday!5e0!3m2!1sid!2sid!4v1776918776676!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="bg-[#C4D0A3] text-center text-white font-semibold text-sm py-4">
        Created by Nawa Everyday
      </div>
    </footer>
  );
}