import DoctorCardList from "@/components/cards/DoctorCardList";

const ListDoctorPage = () => {
  return (
    <div className="py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-6 text-center tracking-tight drop-shadow">
        Bác Sĩ Ưu Tú
      </h1>
      <DoctorCardList />
    </div>
  );
};

export default ListDoctorPage;
