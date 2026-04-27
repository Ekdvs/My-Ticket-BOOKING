import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Axios from "../../utils/Axios";
import toast from "react-hot-toast";
import useSound from "use-sound";
import { motion, AnimatePresence } from "framer-motion";

const QrScannerPremium = () => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef(false);

  const [scanning, setScanning] = useState(true);
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<null | "success" | "error">(null);
  const [message, setMessage] = useState("");

  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");

  // 🔥 Start Scanner
  useEffect(() => {
    if (!started || startedRef.current) return;

    startedRef.current = true;

    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || devices.length === 0) {
          toast.error("No camera found ❌");
          return;
        }

        // Prefer back camera
        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back")
        );

        const cameraId = backCamera?.id || devices[0].id;

        scanner
          .start(
            cameraId,
            { fps: 10, qrbox: 250 },
            handleScanSuccess,
            () => {}
          )
          .catch((err) => {
            console.error(err);
            toast.error("Camera start failed ❌");
          });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Camera permission denied ❌");
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => scannerRef.current?.clear())
          .catch(() => {});
      }
    };
  }, [started]);

  // 🔥 Scan Handler
  const handleScanSuccess = async (decodedText: string) => {
    if (!scanning) return;

    setScanning(false);

    try {
      const res = await Axios.post("/scan", {
        token: decodedText,
      });

      if (res.data.success) {
        playSuccess();
        setResult("success");
        setMessage("Access Granted ✅");
      } else {
        playError();
        setResult("error");
        setMessage(res.data.message || "Invalid Ticket ❌");
      }
    } catch (err: any) {
      playError();
      setResult("error");
      setMessage(
        err?.response?.data?.message || "Invalid or Expired QR ❌"
      );
    }

    // Reset scanner after 3 sec
    setTimeout(() => {
      setResult(null);
      setScanning(true);
    }, 3000);
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white relative">

      {/* Start Button (important for mobile Safari) */}
      {!started && (
        <button
          onClick={() => setStarted(true)}
          className="bg-green-500 px-6 py-3 rounded-xl text-lg font-semibold"
        >
          Start Scanning
        </button>
      )}

      {/* Camera */}
      <div
        id="qr-reader"
        className={`w-full max-w-md rounded-xl overflow-hidden ${
          !started ? "hidden" : ""
        }`}
      />

      {/* Scan Box */}
      {started && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-4 border-green-400 rounded-xl animate-pulse"></div>
        </div>
      )}

      {/* Result Overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex flex-col items-center justify-center ${
              result === "success"
                ? "bg-green-600/90"
                : "bg-red-600/90"
            }`}
          >
            <h1 className="text-4xl font-bold mb-4">
              {result === "success" ? "✔ SUCCESS" : "✖ ERROR"}
            </h1>
            <p className="text-lg">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <p className="absolute bottom-5 text-sm text-gray-300">
        Scan QR Ticket to Verify Entry
      </p>
    </div>
  );
};

export default QrScannerPremium;