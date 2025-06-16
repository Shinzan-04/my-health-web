"use client";
import { useEffect, useState } from "react";
import ApiService from "@/app/service/ApiService";

type ARVRegimen = {
    arvRegimenId?: number;
    doctorName?: string;
    createDate: string;
    endDate: string;
    regimenName: string;
    regimenCode: string;
    description: string;
    medicationSchedule: string;
    duration: number;
};

export default function ARVRegimenCustomerHistory() {
    const [arvs, setArvs] = useState<ARVRegimen[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchArvRegimens() {
            const raw = localStorage.getItem("authData");
            if (!raw) {
                setError("Vui lòng đăng nhập để xem phác đồ ARV.");
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
                    // Bây giờ lấy phác đồ ARV bằng customerId đã lấy
                    const data = await ApiService.getARVRegimensByCustomerId(fetchedCustomerId);
                    setArvs(data);
                } else {
                    const data = await ApiService.getARVRegimensByCustomerId(customerId);
                    setArvs(data);
                }
            } catch (err) {
                console.error("Lỗi khi tải phác đồ ARV:", err);
                setError("Lỗi xác thực người dùng hoặc tải dữ liệu phác đồ ARV.");
            } finally {
                setLoading(false);
            }
        }
        fetchArvRegimens();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
                Đang tải phác đồ ARV...
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
                    Phác đồ ARV
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-3 border text-base">Ngày bắt đầu</th>
                                <th className="py-2 px-3 border text-base">Ngày kết thúc</th>
                                <th className="py-2 px-3 border text-base">Tên phác đồ</th>
                                <th className="py-2 px-3 border text-base">Mã</th>
                                <th className="py-2 px-3 border text-base">Bác sĩ</th>
                                <th className="py-2 px-3 border text-base">Lịch uống</th>
                                <th className="py-2 px-3 border text-base">Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {arvs.length === 0 ? (
                                <tr>
                                    <td className="py-3 px-4 border text-center" colSpan={7}>
                                        Không có dữ liệu phác đồ ARV.
                                    </td>
                                </tr>
                            ) : (
                                arvs.map((arv) => (
                                    <tr key={arv.arvRegimenId} className="hover:bg-blue-50">
                                        <td className="py-2 px-3 border">{arv.createDate}</td>
                                        <td className="py-2 px-3 border">{arv.endDate}</td>
                                        <td className="py-2 px-3 border">{arv.regimenName}</td>
                                        <td className="py-2 px-3 border">{arv.regimenCode}</td>
                                        <td className="py-2 px-3 border">{arv.doctorName}</td>
                                        <td className="py-2 px-3 border">{arv.medicationSchedule}</td>
                                        <td className="py-2 px-3 border">{arv.description}</td>
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
