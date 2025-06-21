import DoctorCard from "@/components/cards/DoctorCard";

const ListDoctorPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Danh sách bác sĩ</h1>
      <DoctorCard />
    </div>
  );
};

export default ListDoctorPage;
