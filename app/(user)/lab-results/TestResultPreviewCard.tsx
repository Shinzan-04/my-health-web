import { FC } from "react";

type Props = {
  customerName: string;
  customerEmail?: string;
  doctorName: string;
  date: string;
  typeOfTest: string;
  resultDescription: string;
  testResultId: number;
};

const TestResultPreviewCard: FC<Props> = ({
  customerName,
  customerEmail,
  doctorName,
  date,
  typeOfTest,
  resultDescription,
  testResultId,
}) => {
  const patientCode = `TR-${testResultId}`;
  const resultCode = `PXN-${testResultId}`;

  return (
    <div className="bg-white text-black w-full max-w-[1000px] mx-auto p-10 shadow-md border border-gray-300 rounded-lg print:max-w-full print:shadow-none print:border">

      {/* Header - Logo & Tiêu đề */}
      <div className="text-center mb-6">
        <img src="/logo.jpg" alt="logo" className="h-16 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-900 uppercase">
          Trung tâm xét nghiệm NTX
        </h1>
        <p className="text-sm text-gray-600">Khám và điều trị bệnh HIV</p>
        <h2 className="text-lg font-semibold uppercase mt-3 underline">
          Phiếu kết quả xét nghiệm
        </h2>
      </div>

      {/* Mã số và thông tin bệnh nhân */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 text-sm text-gray-800 mb-6 px-2">
        <p><strong>Mã phiếu:</strong> {resultCode}</p>
        <p><strong>Mã bệnh nhân:</strong> {patientCode}</p>
        <p><strong>Họ và tên:</strong> {customerName || "Ẩn danh"}</p>
        {customerEmail && <p><strong>Email:</strong> {customerEmail}</p>}
        <p><strong>Ngày xét nghiệm:</strong> {date}</p>
        <p><strong>Bác sĩ phụ trách:</strong> {doctorName || "Không rõ"}</p>
      </div>

      {/* Bảng kết quả xét nghiệm */}
      <div className="mb-6">
        <table className="w-full text-sm border border-gray-400">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-400 px-4 py-2 text-left">Tên xét nghiệm</th>
              <th className="border border-gray-400 px-4 py-2 text-left">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-400 px-4 py-2">{typeOfTest}</td>
              <td className="border border-gray-400 px-4 py-2 whitespace-pre-line">{resultDescription}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ghi chú & ngày lập phiếu */}
      <div className="text-sm text-gray-700 mb-10">
        <p><strong>Ghi chú:</strong> Kết quả chỉ có giá trị tại thời điểm xét nghiệm.</p>
        <p className="mt-2 italic text-right">Ngày lập phiếu: {date}</p>
      </div>

      {/* Chữ ký */}
      <div className="flex justify-end">
        <div className="text-sm text-gray-700 text-center">
          <p>Người xét nghiệm</p>
          <div className="mt-12 border-t border-black w-40 text-center font-medium pt-1">
            {doctorName || "N/A"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultPreviewCard;
