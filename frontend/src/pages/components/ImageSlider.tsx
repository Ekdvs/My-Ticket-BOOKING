"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
}

export default function ImageSlider({ images }: Props) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[350px] flex items-center justify-center bg-gray-200 rounded-xl">
        No Images Available
      </div>
    );
  }

  const next = () => setActive((prev) => (prev + 1) % images.length);
  const prev = () => setActive((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative w-full h-[350px] lg:h-[450px] bg-gray-100 rounded-2xl overflow-hidden shadow group">
        <img
          src={images[active]}
          className="w-full h-full object-cover cursor-pointer transition group-hover:scale-110"
          onClick={() => setFullscreen(true)}
        />

        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <ChevronLeft />
        </button>

        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
          <ChevronRight />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActive(i)}
              className={`w-12 h-12 object-cover rounded cursor-pointer border ${
                active === i ? "border-black" : "opacity-60"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-5 right-5 bg-white p-2 rounded-full"
            >
              <X />
            </button>

            <img src={images[active]} className="max-w-[90%] max-h-[90%]" />

            <button onClick={prev} className="absolute left-5 text-white">
              <ChevronLeft size={40} />
            </button>

            <button onClick={next} className="absolute right-5 text-white">
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}