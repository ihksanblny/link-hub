// src/components/home/FooterSection.tsx

import Link from "next/link";
import { Link2Icon, MountainIcon } from "lucide-react";

export default function FooterSection() {
  return (
    <>
      {/* 1. Final Call to Action (CTA) Block */}
      <section className="w-full py-20 bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="container px-4 md:px-6 mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Siap Membuat Link-in-Bio Terbaik Anda?
          </h2>
          <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
            Daftar sekarang, kelola semua tautan Anda, dan pamerkan profil LinkHub yang cepat dan profesional.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-full px-10 text-lg font-bold text-white transition-all duration-300 
                       bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-xl hover:shadow-2xl"
          >
            Mulai LinkHub Gratis Sekarang
          </Link>
        </div>
      </section>

      {/* 2. Footer Minimalis */}
      <footer className="w-full py-8 bg-black border-t border-gray-900">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between text-center md:text-left">
          <div className="flex items-center space-x-2">
            <Link2Icon className="h-6 w-6 text-purple-500" />
            <span className="font-bold text-lg text-white">Link-Hub</span>
          </div>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} LinkHub. Semua hak cipta dilindungi.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#privacy" className="text-sm text-gray-500 hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#terms" className="text-sm text-gray-500 hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}