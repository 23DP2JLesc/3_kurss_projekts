import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({
    data: [
      // EXHAUST
      {
        id: "seed-1",
        name: "Titanium Racing Exhaust System",
        brand: "Akrapovič",
        model: "ZX-10R",
        type: "Exhaust",
        category: "Exhaust",
        price: 1299.99,
        originalPrice: 1599.99,
        image: "https://via.placeholder.com/300?text=Exhaust",
        stock: 7,
        fitment: JSON.stringify([
          "Kawasaki ZX-10R", "Kawasaki ZX-6R", "Kawasaki ZX-10RR",
          "BMW S1000RR", "BMW M1000RR", "BMW S1000R",
          "Yamaha R1", "Yamaha R6", "Yamaha MT-10",
          "Ducati Panigale V4", "Ducati Panigale V2"
        ]),
        description: "Lightweight titanium race exhaust tuned for sharper throttle response, lower weight, and track-ready sound.",
      },
      {
        id: "seed-7",
        name: "Carbon Slip-On Exhaust",
        brand: "Akrapovič",
        model: "CBR1000RR",
        type: "Exhaust",
        category: "Exhaust",
        price: 699.99,
        originalPrice: 849.99,
        image: "https://via.placeholder.com/300?text=SlipOn",
        stock: 9,
        fitment: JSON.stringify([
          "Honda CBR1000RR", "Honda CBR600RR", "Honda CB1000R",
          "Suzuki GSX-R1000", "Suzuki GSX-R750", "Suzuki GSX-R600",
          "Aprilia RSV4", "Aprilia RS660", "Aprilia Tuono V4",
          "KTM RC8R", "KTM Duke 890"
        ]),
        description: "Lightweight carbon fiber slip-on exhaust for improved sound and weight reduction.",
      },
      {
        id: "seed-8",
        name: "Full Titanium Race System",
        brand: "Yoshimura",
        model: "GSX-R1000",
        type: "Exhaust",
        category: "Exhaust",
        price: 1599.99,
        image: "https://via.placeholder.com/300?text=Yoshimura",
        stock: 5,
        fitment: JSON.stringify([
          "Suzuki GSX-R1000", "Suzuki GSX-R750", "Suzuki GSX-S1000",
          "Honda CBR1000RR", "Honda CB1000R", "Honda Hornet",
          "Kawasaki ZX-10R", "Kawasaki Z1000", "Kawasaki Z900",
          "Yamaha R1", "Yamaha FZ-10"
        ]),
        description: "Full titanium race exhaust system for maximum power gains and weight savings.",
      },

      // BRAKES
      {
        id: "seed-2",
        name: "Brembo Racing Brake Kit",
        brand: "Brembo",
        model: "Panigale V4",
        type: "Brakes",
        category: "Brakes",
        price: 849.99,
        image: "https://via.placeholder.com/300?text=Brakes",
        stock: 11,
        fitment: JSON.stringify([
          "Ducati Panigale V4", "Ducati Panigale V2", "Ducati Streetfighter V4",
          "Yamaha R1", "Yamaha R6", "Yamaha MT-10",
          "BMW S1000RR", "BMW M1000RR", "BMW S1000R",
          "Aprilia RSV4", "Aprilia Tuono V4"
        ]),
        description: "High-bite caliper and rotor kit built for consistent stopping power under heavy race braking.",
      },
      {
        id: "seed-9",
        name: "Brembo GP4-RX Calipers",
        brand: "Brembo",
        model: "RSV4",
        type: "Brakes",
        category: "Brakes",
        price: 1249.99,
        originalPrice: 1499.99,
        image: "https://via.placeholder.com/300?text=GP4RX",
        stock: 6,
        fitment: JSON.stringify([
          "Aprilia RSV4", "Aprilia RS660", "Aprilia Tuono V4",
          "Ducati Panigale V4", "Ducati Monster", "Ducati Diavel",
          "KTM RC8R", "KTM SuperDuke 1290", "KTM Duke 890",
          "Honda CBR1000RR", "Honda Fireblade"
        ]),
        description: "GP4-RX monobloc calipers used in MotoGP for ultimate braking performance.",
      },
      {
        id: "seed-10",
        name: "Steel Braided Brake Lines",
        brand: "Galfer",
        model: "ZX-10R",
        type: "Brakes",
        category: "Brakes",
        price: 189.99,
        image: "https://via.placeholder.com/300?text=BrakeLines",
        stock: 20,
        fitment: JSON.stringify([
          "Kawasaki ZX-10R", "Kawasaki ZX-6R", "Kawasaki Z900",
          "Yamaha R1", "Yamaha R6", "Yamaha MT-09",
          "Honda CBR1000RR", "Honda CBR600RR", "Honda CB650R",
          "Suzuki GSX-R1000", "Suzuki SV650"
        ]),
        description: "Steel braided brake lines for improved feel and consistent brake performance.",
      },

      // SUSPENSION
      {
        id: "seed-3",
        name: "Öhlins TTX GP Suspension Fork",
        brand: "Öhlins",
        model: "S1000RR",
        type: "Suspension",
        category: "Suspension",
        price: 2199.99,
        originalPrice: 2499.99,
        image: "https://via.placeholder.com/300?text=Suspension",
        stock: 4,
        fitment: JSON.stringify([
          "BMW S1000RR", "BMW M1000RR", "BMW S1000R",
          "Kawasaki ZX-10R", "Kawasaki ZX-10RR", "Kawasaki ZX-6R",
          "Ducati Panigale V4", "Ducati Panigale V2", "Ducati Streetfighter",
          "Aprilia RSV4", "Aprilia Tuono V4"
        ]),
        description: "Fully adjustable cartridge suspension with GP-derived damping control for precise front-end feedback.",
      },
      {
        id: "seed-11",
        name: "Öhlins STX46 Rear Shock",
        brand: "Öhlins",
        model: "R1",
        type: "Suspension",
        category: "Suspension",
        price: 1299.99,
        image: "https://via.placeholder.com/300?text=RearShock",
        stock: 8,
        fitment: JSON.stringify([
          "Yamaha R1", "Yamaha R6", "Yamaha MT-10",
          "Honda CBR1000RR", "Honda CBR600RR", "Honda CB1000R",
          "Suzuki GSX-R1000", "Suzuki GSX-R750", "Suzuki Hayabusa",
          "KTM RC8R", "KTM SuperDuke 1290"
        ]),
        description: "STX46 rear shock absorber with titanium spring for track and road use.",
      },
      {
        id: "seed-12",
        name: "Wilbers Suspension Kit",
        brand: "Wilbers",
        model: "CBR1000RR",
        type: "Suspension",
        category: "Suspension",
        price: 899.99,
        originalPrice: 1099.99,
        image: "https://via.placeholder.com/300?text=Wilbers",
        stock: 5,
        fitment: JSON.stringify([
          "Honda CBR1000RR", "Honda CBR600RR", "Honda Fireblade",
          "BMW S1000RR", "BMW R1250GS", "BMW F850GS",
          "Kawasaki ZX-10R", "Kawasaki Versys 1000", "Kawasaki Z900",
          "Triumph Daytona 675", "Triumph Speed Triple"
        ]),
        description: "Complete suspension kit with adjustable fork springs and rear shock.",
      },

      // BODYWORK
      {
        id: "seed-4",
        name: "Carbon Fiber Race Fairings",
        brand: "Ilmberger",
        model: "R1",
        type: "Bodywork",
        category: "Bodywork",
        price: 1899.99,
        image: "https://via.placeholder.com/300?text=Fairings",
        stock: 5,
        fitment: JSON.stringify([
          "Yamaha R1", "Yamaha R6", "Yamaha R7",
          "Ducati Panigale V4", "Ducati Panigale V2", "Ducati Monster",
          "BMW S1000RR", "BMW M1000RR", "BMW HP4",
          "Aprilia RSV4", "Aprilia RS660"
        ]),
        description: "Pre-drilled carbon fairing set with race geometry, heat shielding, and fast service access.",
      },
      {
        id: "seed-13",
        name: "Carbon Tank Cover",
        brand: "Ilmberger",
        model: "S1000RR",
        type: "Bodywork",
        category: "Bodywork",
        price: 499.99,
        originalPrice: 599.99,
        image: "https://via.placeholder.com/300?text=TankCover",
        stock: 10,
        fitment: JSON.stringify([
          "BMW S1000RR", "BMW M1000RR", "BMW S1000R",
          "Kawasaki ZX-10R", "Kawasaki ZX-6R", "Kawasaki Z900",
          "Honda CBR1000RR", "Honda CBR600RR", "Honda CB1000R",
          "Suzuki GSX-R1000", "Suzuki GSX-S1000"
        ]),
        description: "Lightweight carbon fiber tank cover for weight reduction and visual enhancement.",
      },
      {
        id: "seed-14",
        name: "Belly Pan Carbon",
        brand: "Puig",
        model: "Panigale V4",
        type: "Bodywork",
        category: "Bodywork",
        price: 349.99,
        image: "https://via.placeholder.com/300?text=BellyPan",
        stock: 12,
        fitment: JSON.stringify([
          "Ducati Panigale V4", "Ducati Panigale V2", "Ducati Streetfighter V4",
          "Aprilia RSV4", "Aprilia Tuono V4", "Aprilia RS660",
          "KTM RC8R", "KTM SuperDuke 1290", "KTM Duke 890",
          "Triumph Daytona 675", "Triumph Speed Triple"
        ]),
        description: "Carbon fiber belly pan for improved aerodynamics and engine protection.",
      },

      // ENGINE
      {
        id: "seed-5",
        name: "Performance Air Filter",
        brand: "Sprint Filter",
        model: "RSV4",
        type: "Engine",
        category: "Engine",
        price: 149.99,
        image: "https://via.placeholder.com/300?text=Air+Filter",
        stock: 18,
        fitment: JSON.stringify([
          "Aprilia RSV4", "Aprilia Tuono V4", "Aprilia RS660",
          "BMW S1000RR", "BMW M1000RR", "BMW S1000R",
          "Ducati Panigale V4", "Ducati Monster", "Ducati Multistrada",
          "KTM SuperDuke 1290", "KTM Duke 890"
        ]),
        description: "Washable high-flow air filter that improves intake breathing while protecting the engine.",
      },
      {
        id: "seed-15",
        name: "Quick Shifter Kit",
        brand: "Healtech",
        model: "ZX-10R",
        type: "Engine",
        category: "Engine",
        price: 299.99,
        originalPrice: 349.99,
        image: "https://via.placeholder.com/300?text=QuickShifter",
        stock: 14,
        fitment: JSON.stringify([
          "Kawasaki ZX-10R", "Kawasaki ZX-6R", "Kawasaki ZX-10RR",
          "Yamaha R1", "Yamaha R6", "Yamaha MT-10",
          "Honda CBR1000RR", "Honda CBR600RR", "Honda CB1000R",
          "Suzuki GSX-R1000", "Suzuki GSX-R750"
        ]),
        description: "Plug-and-play quick shifter for seamless upshifts and downshifts without clutch use.",
      },
      {
        id: "seed-16",
        name: "Titanium Engine Bolts Kit",
        brand: "Driven Racing",
        model: "R1",
        type: "Engine",
        category: "Engine",
        price: 199.99,
        image: "https://via.placeholder.com/300?text=TiBolts",
        stock: 22,
        fitment: JSON.stringify([
          "Yamaha R1", "Yamaha R6", "Yamaha R7",
          "Ducati Panigale V4", "Ducati Panigale V2", "Ducati Monster",
          "Aprilia RSV4", "Aprilia RS660", "Aprilia Tuono",
          "BMW S1000RR", "BMW HP4"
        ]),
        description: "Full titanium engine bolt kit for significant weight reduction and corrosion resistance.",
      },

      // LIGHTING
      {
        id: "seed-6",
        name: "LED Headlight Kit",
        brand: "Rizoma",
        model: "MT-10",
        type: "Lighting",
        category: "Lighting",
        price: 299.99,
        originalPrice: 349.99,
        image: "https://via.placeholder.com/300?text=Headlight",
        stock: 0,
        fitment: JSON.stringify([
          "Yamaha MT-10", "Yamaha MT-09", "Yamaha MT-07",
          "Kawasaki Z900", "Kawasaki Z650", "Kawasaki Z1000",
          "Honda CB650R", "Honda CB1000R", "Honda Hornet",
          "Suzuki GSX-S750", "Suzuki SV650"
        ]),
        description: "High-intensity LED headlight module with integrated turn signals for modern aesthetic.",
      },
      {
        id: "seed-17",
        name: "LED Turn Signal Kit",
        brand: "Rizoma",
        model: "GSX-R1000",
        type: "Lighting",
        category: "Lighting",
        price: 149.99,
        image: "https://via.placeholder.com/300?text=TurnSignals",
        stock: 16,
        fitment: JSON.stringify([
          "Suzuki GSX-R1000", "Suzuki GSX-S1000", "Suzuki SV650",
          "Honda CBR1000RR", "Honda CB650R", "Honda Monkey",
          "Kawasaki Z900", "Kawasaki Z650", "Kawasaki Ninja 400",
          "Yamaha MT-07", "Yamaha XSR900"
        ]),
        description: "Slim LED turn signals with E-mark approval for road legal use.",
      },
      {
        id: "seed-18",
        name: "Daytime Running Light Kit",
        brand: "Koso",
        model: "CB1000R",
        type: "Lighting",
        category: "Lighting",
        price: 99.99,
        originalPrice: 129.99,
        image: "https://via.placeholder.com/300?text=DRL",
        stock: 25,
        fitment: JSON.stringify([
          "Honda CB1000R", "Honda CB650R", "Honda CB500F",
          "Yamaha MT-09", "Yamaha MT-07", "Yamaha Tracer 900",
          "Kawasaki Z900", "Kawasaki Versys 650", "Kawasaki Ninja 650",
          "Suzuki GSX-S750", "Suzuki V-Strom 650"
        ]),
        description: "Universal DRL kit for improved visibility and modern styling.",
      },
    ],
  });

  console.log("✅ Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });