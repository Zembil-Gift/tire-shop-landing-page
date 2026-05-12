export const business = {
    name: "Putnam Tire & Auto Repair",
    phone: "(601) 366-1886",
    displayPhone: "(601) 366-1886",
    address: "4879 N State St, Jackson, MS 39206",
    hours: "Mon–Fri: 8:00 AM – 6:00 PM · Sat: 9:00 AM – 5:00 PM · Sun: 9:30 AM – 5:00 PM",
    googleBusinessProfile: "https://www.google.com/search?q=Putnam+Tire+%26+Auto+Repair+Jackson+MS",
};

export const services = [
    "New Tire Sales",
    "Tire Installation",
    "Flat Tire Repair",
    "Tire Replacement",
    "Wheel Balancing",
    "Wheel Alignment",
    "Rim Repair",
    "Truck & SUV Tires",
];

export const appointmentServiceOptions = [
    "Tire Installation",
    "Flat Tire Repair",
    "Tire Replacement",
    "Wheel Balancing",
    "Wheel Alignment",
    "Rim Repair",
];

export const tireTypeOptions = [
    { label: "Budget", value: "BUDGET" },
    { label: "Mid-range", value: "MID_RANGE" },
    { label: "Premium", value: "PREMIUM" },
    { label: "Not sure", value: "NOT_SURE" },
] as const;

export const reviews = [
    {
        name: "Michael R.",
        text: "They fixed my flat tire fast and the price was fair. Great customer service.",
    },
    {
        name: "Sarah T.",
        text: "Very professional team. I got new tires and balancing done the same day.",
    },
    {
        name: "Daniel K.",
        text: "Clean shop, honest pricing, and quick service. I highly recommend them.",
    },
];
