const popularVehiclesByMake = {
  Chevrolet: [
    "Silverado",
    "Equinox",
    "Malibu",
    "Tahoe",
    "Suburban",
    "Colorado",
    "Blazer",
    "Traverse",
    "Trailblazer",
    "Corvette",
    "Camaro",
    "Bolt EV",
    "Trax",
  ],
  Ford: [
    "F-150",
    "F-250",
    "Escape",
    "Explorer",
    "Mustang",
    "Bronco",
    "Bronco Sport",
    "Edge",
    "Expedition",
    "Maverick",
    "Ranger",
    "Explorer Hybrid",
    "Mustang Mach-E",
  ],
  GMC: [
    "Sierra 1500",
    "Sierra 2500",
    "Terrain",
    "Acadia",
    "Yukon",
    "Yukon XL",
    "Canyon",
    "Savana",
    "Hummer EV",
  ],
  Honda: [
    "CR-V",
    "Civic",
    "Accord",
    "Pilot",
    "Odyssey",
    "HR-V",
    "Passport",
    "Ridgeline",
    "Insight",
    "Prologue",
  ],
  Hyundai: [
    "Tucson",
    "Santa Fe",
    "Elantra",
    "Sonata",
    "Kona",
    "Palisade",
    "Ioniq 5",
    "Ioniq 6",
    "Santa Cruz",
    "Venue",
    "Accent",
  ],
  Jeep: [
    "Grand Cherokee",
    "Wrangler",
    "Cherokee",
    "Compass",
    "Renegade",
    "Gladiator",
    "Wagoneer",
    "Grand Wagoneer",
  ],
  Mazda: [
    "CX-5",
    "CX-30",
    "CX-50",
    "CX-9",
    "CX-90",
    "Mazda3",
    "Mazda6",
    "MX-5 Miata",
  ],
  Nissan: [
    "Rogue",
    "Altima",
    "Sentra",
    "Frontier",
    "Pathfinder",
    "Murano",
    "Titan",
    "Versa",
    "Kicks",
    "Ariya",
    "Maxima",
    "Armada",
  ],
  Ram: ["1500", "2500", "3500", "ProMaster", "1500 Classic", "TRX"],
  Subaru: [
    "Outback",
    "Crosstrek",
    "Forester",
    "Impreza",
    "Legacy",
    "Ascent",
    "BRZ",
    "WRX",
    "Solterra",
  ],
  Tesla: ["Model Y", "Model 3", "Model X", "Model S", "Cybertruck"],
  Toyota: [
    "RAV4",
    "Camry",
    "Tacoma",
    "Corolla",
    "Highlander",
    "4Runner",
    "Tundra",
    "Sienna",
    "Prius",
    "Venza",
    "Sequoia",
    "Corolla Cross",
    "GR86",
    "Crown",
  ],
} as const;

const DEFAULT_SUGGESTION_LIMIT = 8;

function normalize(value: string) {
  return value.trim().toLowerCase();
}

const makes = Object.keys(popularVehiclesByMake);
const makeModelsEntries = Object.entries(popularVehiclesByMake);
const makeModelsMap = new Map<string, readonly string[]>(
  makeModelsEntries.map(([make, models]) => [normalize(make), models])
);

const allModels = [
  ...new Set(makeModelsEntries.flatMap(([, models]) => models)),
];

const modelToMakeMap = new Map<string, string>();
for (const [make, models] of makeModelsEntries) {
  for (const model of models) {
    if (!modelToMakeMap.has(normalize(model))) {
      modelToMakeMap.set(normalize(model), make);
    }
  }
}

function filterByQuery(
  options: readonly string[],
  query: string,
  limit = DEFAULT_SUGGESTION_LIMIT
): string[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return options.slice(0, limit);
  }

  const startsWithMatches = options.filter((option) =>
    normalize(option).startsWith(normalizedQuery)
  );
  const containsMatches = options.filter(
    (option) =>
      normalize(option).includes(normalizedQuery) &&
      !startsWithMatches.includes(option)
  );

  return [...startsWithMatches, ...containsMatches].slice(0, limit);
}

export function getSuggestedMakes(query: string): string[] {
  return filterByQuery(makes, query);
}

export function getSuggestedModels(make: string, query: string): string[] {
  const modelsForMake = makeModelsMap.get(normalize(make));
  if (modelsForMake) {
    return filterByQuery(modelsForMake, query);
  }

  if (!make.trim()) {
    return filterByQuery(allModels, query);
  }

  return [];
}

export function resolveMakeFromModel(model: string): string | undefined {
  return modelToMakeMap.get(normalize(model));
}
