export const machinesData = [
    {
        id: 1,
        name: "FIAT COUPE",
        model: "2.0 16V",
        year: "1996",
        color: "ROSSO CORSA",
        plate: "55 NM 686",
        specs: {
            ENGINE: "2.0 16V ATMOSPHERIC",
            POWER: "139 HP (102 kW) @ 6000 RPM",
            TORQUE: "180 NM @ 4500 RPM",
            ACCEL: "0-100: 9.2 SEC",
            TOP_SPEED: "235 KM/H"
        },
        mods: [
            "BREMBO BRAKES",
            "LEATHER INTERIOR",
            "CUSTOM EXHAUST",
            "STAGE 1 SOFTWARE"
        ],
        description: "The Italian legend. Pininfarina design meets raw turbo power. A timeless classic kept in pristine condition for street dominance.",
        isRacer: true, // Shows Race Log & Victory List
        background: "/assets/racelog_final_bg.png" // Specific background for this car
    },
    {
        id: 2,
        name: "KUBA BRILLIANT",
        model: "125 CC MODIFIED",
        year: "2024",
        color: "MATTE BLACK",
        plate: "34 JB 125",
        specs: {
            ENGINE: "125CC SINGLE CYL",
            POWER: "12 HP",
            TORQUE: "10 NM",
            WEIGHT: "95 KG",
            TOP_SPEED: "110 KM/H"
        },
        mods: [
            "PERFORMANCE EXHAUST",
            "LOWERED SUSPENSION",
            "LED UNDERGLOW"
        ],
        description: "City phantom. Agile, loud, and built for the urban jungle. The perfect machine for quick maneuvers and night rides.",
        isRacer: false,
        background: "/assets/hangar_bg.png" // Default hangar or specific bike bg
    },
    {
        id: 3,
        name: "PROJECT X",
        model: "CLASSIFIED",
        year: "2026",
        color: "UNKNOWN",
        plate: "UNKNOWN",
        specs: {
            ENGINE: "CLASSIFIED",
            POWER: "UNKNOWN",
            TORQUE: "UNKNOWN",
            WEIGHT: "UNKNOWN",
            TOP_SPEED: "UNKNOWN"
        },
        mods: ["CLASSIFIED"],
        description: "Data corrupted. Access denied. Future project loading...",
        isRacer: false,
        background: "/assets/blueprint_placeholder.png"
    }
];
