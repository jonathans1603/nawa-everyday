import Playbox from '../assets/Playbox.jpg';
import MeetingRoom from '../assets/Meeting room.jpg';
import OutdoorSpace from '../assets/Outdoor space.jpg';
import backgroudemas from '../assets/background emas.png';

const facilities = [
  {
    id: 1,
    title: "PlayBox",
    image: Playbox,
    description:
      "Ruang santai dengan suasana cozy, dilengkapi permainan board games dan hiburan untuk bersantai bersama teman.",
  },
  {
    id: 2,
    title: "Meeting Room",
    image: MeetingRoom,
    description:
      "Ruang meeting profesional dengan fasilitas lengkap, cocok untuk rapat bisnis maupun diskusi kelompok.",
  },
  {
    id: 3,
    title: "Outdoor Space",
    image: OutdoorSpace,
    description:
      "Area outdoor yang asri dan nyaman, sempurna untuk menikmati makanan di bawah sinar matahari pagi.",
  },
];

function FacilityCard({ title, image, description }) {
  return (
    <div className="bg-[#f5f0e8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col">
      <div className="w-full h-36 md:h-44 overflow-hidden rounded-t-2xl">
        <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-[#2e2e2e] font-bold text-lg font-serif italic">{title}</h3>
        <p className="text-[#4a4a4a] text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function Facility() {
  return (
    <section 
    className="bg-[#f0e8d0] py-10 px-6"
    style={{ backgroundImage: `url(${backgroudemas})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl px-8 py-10 shadow-lg">
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center border-2 border-[#3d3d3d] rounded-xl px-8 py-2 bg-white/80">
            <h2 className="text-[#2e2e2e] font-bold text-2xl font-serif italic">Our Facility</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facilities.map((f) => (
            <FacilityCard key={f.id} title={f.title} image={f.image} description={f.description} />
          ))}
        </div>
       </div> 
      </div>
    </section>
  );
}
