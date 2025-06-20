import DoctorCardList from "@/components/cards/DoctorCardList";

const ListDoctorPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Bác Sĩ Ưu Tú</h1>
      <DoctorCardList />
    </div>
  );
};

export default ListDoctorPage;
