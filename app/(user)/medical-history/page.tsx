"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type MedicalHistory = {
    medicalHistoryId?: number;
    visitDate: string;
    reason: string;
    diagnosis: string;
    treatment: string;
    prescription: string;
    notes: string;
};

export default function MedicalHistoryDetail() {
    const [histories, setHistories] = useState<MedicalHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMedicalHistories() {
            const raw = localStorage.getItem("authData");
            if (!raw) {
                setError("Vui lòng đăng nhập để xem lịch sử khám bệnh.");
                setLoading(false);
                return;
            }
            try {
                const authData = JSON.parse(raw);
                const customerId =
                    authData.customerID ||
                    authData.customer?.customerID ||
                    authData.customer?.customerId ||
                    null;

                if (!customerId) {
                    // Lấy thông tin khách hàng nếu không tìm thấy customerId
                    const customerProfile = await ApiService.getMyCustomerProfile();
                    const fetchedCustomerId = customerProfile.customerID || customerProfile.id;

                    if (!fetchedCustomerId) {
                        throw new Error("Không tìm thấy thông tin người dùng.");
                    }
                    // Bây giờ lấy lịch sử khám bệnh bằng customerId đã lấy
                    const data = await ApiService.getMedicalHistoriesByCustomerId(fetchedCustomerId);
                    setHistories(data);
                } else {
                    const data = await ApiService.getMedicalHistoriesByCustomerId(customerId);
                    setHistories(data);
                }
            } catch (err) {
                console.error("Lỗi khi tải lịch sử khám bệnh:", err);
                setError("Lỗi xác thực người dùng hoặc tải dữ liệu lịch sử khám bệnh.");
            } finally {
                setLoading(false);
            }
        }
        fetchMedicalHistories();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
                Đang tải lịch sử khám bệnh...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold p-4">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-0 bg-gray-100 flex items-start justify-center pt-10 px-2">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
                    Lịch sử khám bệnh
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-3 border text-base">Ngày khám</th>
                                <th className="py-2 px-3 border text-base">Lý do khám</th>
                                <th className="py-2 px-3 border text-base">Chẩn đoán</th>
                                <th className="py-2 px-3 border text-base">Điều trị</th>
                                <th className="py-2 px-3 border text-base">Đơn thuốc</th>
                                <th className="py-2 px-3 border text-base">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {histories.length === 0 ? (
                                <tr>
                                    <td className="py-3 px-4 border text-center" colSpan={6}>
                                        Không có dữ liệu lịch sử khám bệnh.
                                    </td>
                                </tr>
                            ) : (
                                histories.map((history) => (
                                    <tr key={history.medicalHistoryId} className="hover:bg-blue-50">
                                        <td className="py-2 px-3 border">{history.visitDate}</td>
                                        <td className="py-2 px-3 border">{history.reason}</td>
                                        <td className="py-2 px-3 border">{history.diagnosis}</td>
                                        <td className="py-2 px-3 border">{history.treatment}</td>
                                        <td className="py-2 px-3 border">{history.prescription}</td>
                                        <td className="py-2 px-3 border">{history.notes}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
