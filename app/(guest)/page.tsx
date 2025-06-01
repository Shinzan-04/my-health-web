export const metadata = {
    title: "Trang Chủ - Y Tế Thông Minh",
    description: "Khám phá các dịch vụ y tế chất lượng cao, đặt lịch dễ dàng.",
};

export default function HomePage() {
    return (
        <div className="flex flex-col">
            {/* Call to Action Section */}
            <section className="bg-blue-600 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl font-bold mb-2">Sẵn sàng chăm sóc sức khỏe của bạn?</h2>
                    <p className="text-base mb-4">Đặt lịch ngay hôm nay để nhận tư vấn từ các bác sĩ hàng đầu!</p>
                    <a
                        href="/booking"
                        className="inline-block bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transform hover:scale-105 transition-transform"
                    >
                        Đặt lịch ngay
                    </a>
                </div>
            </section>
        </div>
    );
}
