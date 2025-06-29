// ContactPage.tsx – Trang liên hệ tĩnh với Google Map và thông tin, có icon, toast, responsive

"use client";
import { Phone, Mail, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ContactPage() {
  const handleFakeSubmit = () => {
    toast.success("Cảm ơn bạn đã liên hệ với chúng tôi!", {
      style: {
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
      },
    });
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-blue-700">Liên hệ với chúng tôi</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Thông tin liên hệ */}
        <div className="space-y-4 text-gray-800">
          <div className="flex items-center gap-3">
            <MapPin className="text-blue-600" />
            <p>123 Đường Y tế, Quận 1, TP.HCM</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="text-blue-600" />
            <p>1900 123 456</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <p>contact@yte.vn</p>
          </div>

          <button
            onClick={handleFakeSubmit}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Gửi yêu cầu (giả lập)
          </button>
        </div>

        {/* Google Map */}
        <div className="rounded overflow-hidden shadow border h-[300px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52728.88016713193!2d106.72986475204655!3d10.803846733390854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527c2f8f30911%3A0x36ac5073f8c91acd!2sLandmark%2081!5e0!3m2!1svi!2s!4v1750773792473!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
