import Link from "next/link";
import CountUp from "react-countup";

export default function KpiCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="
  bg-white 
  border 
  rounded-xl 
  shadow-md 
  hover:shadow-lg 
  transform 
  hover:scale-115 
  transition 
  duration-300 
  ease-in-out 
  p-4
"
    >
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold text-blue-700">
        <CountUp end={value} duration={1} />
      </div>
    </Link>
  );
}
