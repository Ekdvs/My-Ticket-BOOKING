"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiChevronLeft, FiChevronRight, FiMaximize2, FiImage } from "react-icons/fi";

interface Props {
  images: string[];
}

export default function ImageSlider({ images }: Props) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[350px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-2 border-dashed border-gray-300 gap-3">
        <FiImage className="text-gray-400 text-5xl" />
        <p className="text-gray-400 font-medium text-sm tracking-wide">No Images Available</p>
      </div>
    );
  }

  const next = () => setActive((prev) => (prev + 1) % images.length);
  const prev = () => setActive((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Main Slider */}
      <div className="relative w-full h-[350px] lg:h-[480px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group">

        {/* Main Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active]}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setFullscreen(true)}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />

        {/* Expand Icon */}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
          title="View fullscreen"
        >
          <FiMaximize2 className="text-base" />
        </button>

        {/* Image Counter Badge */}
        <div className="absolute top-4 left-4 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
          {active + 1} / {images.length}
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  active === i
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                active === i
                  ? "border-blue-500 shadow-md shadow-blue-200 scale-105"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-5 right-5 bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-full border border-white/20 transition-all duration-200 hover:scale-110 z-10"
            >
              <FiX className="text-xl" />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-5 text-white/70 text-sm font-medium">
              {active + 1} / {images.length}
            </div>

            {/* Image */}
            <motion.img
              key={`fs-${active}`}
              src={images[active]}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />

            {/* Prev / Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-all duration-200 hover:scale-110"
                >
                  <FiChevronLeft className="text-2xl" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full border border-white/20 transition-all duration-200 hover:scale-110"
                >
                  <FiChevronRight className="text-2xl" />
                </button>
              </>
            )}

            {/* Thumbnail strip in fullscreen */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActive(i); }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      active === i ? "border-white scale-110" : "border-white/30 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}