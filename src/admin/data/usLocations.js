// US states + a representative set of cities per state, sorted alphabetically.
// Used by the Address Information card's State/City comboboxes.
// "code" is the USPS 2-letter postal code; "name" is the full state name.

export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// A pragmatic city list — capital + major metros per state. Reasonable for
// "type to filter, pick a real place" UX without bundling the entire USPS
// dataset. Each list is sorted alphabetically.
export const US_CITIES_BY_STATE = {
  AL: ["Birmingham", "Huntsville", "Mobile", "Montgomery", "Tuscaloosa"],
  AK: ["Anchorage", "Fairbanks", "Juneau"],
  AZ: ["Chandler", "Flagstaff", "Gilbert", "Glendale", "Mesa", "Peoria", "Phoenix", "Scottsdale", "Tempe", "Tucson"],
  AR: ["Bentonville", "Fayetteville", "Fort Smith", "Little Rock", "Rogers", "Springdale"],
  CA: [
    "Anaheim", "Bakersfield", "Berkeley", "Burbank", "Carlsbad", "Chula Vista",
    "Costa Mesa", "El Cajon", "El Monte", "Elk Grove", "Escondido", "Fairfield",
    "Fontana", "Fremont", "Fresno", "Fullerton", "Garden Grove", "Glendale",
    "Hayward", "Huntington Beach", "Inglewood", "Irvine", "Lancaster", "Long Beach",
    "Los Angeles", "Modesto", "Moreno Valley", "Murrieta", "Norwalk", "Oakland",
    "Oceanside", "Ontario", "Orange", "Oxnard", "Palmdale", "Pasadena", "Pomona",
    "Rancho Cucamonga", "Rialto", "Riverside", "Roseville", "Sacramento",
    "Salinas", "San Bernardino", "San Diego", "San Francisco", "San Jose",
    "San Mateo", "Santa Ana", "Santa Barbara", "Santa Clara", "Santa Clarita",
    "Santa Maria", "Santa Rosa", "Simi Valley", "Stockton", "Sunnyvale",
    "Temecula", "Thousand Oaks", "Torrance", "Vallejo", "Ventura", "Victorville",
    "Visalia", "West Covina",
  ],
  CO: [
    "Arvada", "Aurora", "Boulder", "Centennial", "Colorado Springs", "Denver",
    "Englewood", "Fort Collins", "Grand Junction", "Greeley", "Lakewood",
    "Littleton", "Longmont", "Loveland", "Pueblo", "Thornton", "Westminster",
  ],
  CT: ["Bridgeport", "Bristol", "Danbury", "Hartford", "New Haven", "Norwalk", "Stamford", "Waterbury"],
  DE: ["Dover", "Newark", "Wilmington"],
  DC: ["Washington"],
  FL: [
    "Boca Raton", "Bradenton", "Cape Coral", "Clearwater", "Coral Springs",
    "Daytona Beach", "Fort Lauderdale", "Fort Myers", "Gainesville", "Hialeah",
    "Hollywood", "Jacksonville", "Kissimmee", "Lakeland", "Miami", "Miami Beach",
    "Naples", "Ocala", "Orlando", "Pembroke Pines", "Pensacola", "Plantation",
    "Pompano Beach", "Port St. Lucie", "Sarasota", "St. Petersburg", "Tallahassee",
    "Tampa", "West Palm Beach",
  ],
  GA: [
    "Alpharetta", "Athens", "Atlanta", "Augusta", "Columbus", "Duluth",
    "Dunwoody", "East Point", "Johns Creek", "Macon", "Marietta", "Roswell",
    "Sandy Springs", "Savannah", "Smyrna", "Valdosta", "Warner Robins",
  ],
  HI: ["Hilo", "Honolulu", "Kailua", "Pearl City"],
  ID: ["Boise", "Coeur d'Alene", "Idaho Falls", "Meridian", "Nampa", "Pocatello", "Twin Falls"],
  IL: [
    "Arlington Heights", "Aurora", "Belleville", "Bloomington", "Champaign",
    "Chicago", "Cicero", "Decatur", "Elgin", "Evanston", "Joliet", "Naperville",
    "Peoria", "Rockford", "Schaumburg", "Springfield", "Waukegan",
  ],
  IN: [
    "Bloomington", "Carmel", "Evansville", "Fishers", "Fort Wayne", "Gary",
    "Greenwood", "Indianapolis", "Kokomo", "Lafayette", "Muncie", "Noblesville",
    "South Bend", "Terre Haute",
  ],
  IA: [
    "Ames", "Ankeny", "Cedar Falls", "Cedar Rapids", "Council Bluffs",
    "Davenport", "Des Moines", "Dubuque", "Iowa City", "Sioux City", "Waterloo",
    "West Des Moines",
  ],
  KS: ["Kansas City", "Lawrence", "Manhattan", "Olathe", "Overland Park", "Topeka", "Wichita"],
  KY: ["Bowling Green", "Covington", "Florence", "Frankfort", "Lexington", "Louisville", "Owensboro"],
  LA: [
    "Alexandria", "Baton Rouge", "Bossier City", "Houma", "Kenner", "Lafayette",
    "Lake Charles", "Monroe", "New Orleans", "Shreveport",
  ],
  ME: ["Auburn", "Bangor", "Lewiston", "Portland"],
  MD: [
    "Annapolis", "Baltimore", "Bethesda", "Bowie", "Frederick", "Gaithersburg",
    "Germantown", "Hagerstown", "Rockville", "Silver Spring", "Towson",
  ],
  MA: [
    "Boston", "Brockton", "Cambridge", "Fall River", "Framingham", "Haverhill",
    "Lawrence", "Lowell", "Lynn", "New Bedford", "Newton", "Quincy", "Somerville",
    "Springfield", "Worcester",
  ],
  MI: [
    "Ann Arbor", "Battle Creek", "Dearborn", "Detroit", "East Lansing", "Farmington Hills",
    "Flint", "Grand Rapids", "Kalamazoo", "Lansing", "Livonia", "Midland",
    "Pontiac", "Rochester Hills", "Royal Oak", "Saginaw", "Southfield",
    "Sterling Heights", "Taylor", "Troy", "Warren", "Westland",
  ],
  MN: [
    "Apple Valley", "Blaine", "Bloomington", "Brooklyn Park", "Burnsville",
    "Coon Rapids", "Duluth", "Eagan", "Eden Prairie", "Maple Grove", "Minneapolis",
    "Minnetonka", "Plymouth", "Rochester", "St. Cloud", "St. Paul", "Woodbury",
  ],
  MS: ["Biloxi", "Gulfport", "Hattiesburg", "Jackson", "Meridian", "Southaven", "Tupelo"],
  MO: [
    "Blue Springs", "Cape Girardeau", "Chesterfield", "Columbia", "Florissant",
    "Independence", "Jefferson City", "Joplin", "Kansas City", "Lee's Summit",
    "O'Fallon", "Springfield", "St. Charles", "St. Joseph", "St. Louis", "Wentzville",
  ],
  MT: ["Billings", "Bozeman", "Butte", "Great Falls", "Helena", "Kalispell", "Missoula"],
  NE: ["Bellevue", "Grand Island", "Kearney", "Lincoln", "Omaha", "Papillion"],
  NV: ["Carson City", "Henderson", "Las Vegas", "North Las Vegas", "Reno", "Sparks"],
  NH: ["Concord", "Dover", "Manchester", "Nashua", "Portsmouth", "Rochester"],
  NJ: [
    "Bayonne", "Camden", "Clifton", "East Orange", "Edison", "Elizabeth",
    "Hackensack", "Hoboken", "Jersey City", "Lakewood", "Newark", "Paramus",
    "Passaic", "Paterson", "Perth Amboy", "Plainfield", "Trenton", "Union City",
    "Vineland", "Woodbridge",
  ],
  NM: ["Albuquerque", "Clovis", "Farmington", "Las Cruces", "Rio Rancho", "Roswell", "Santa Fe"],
  NY: [
    "Albany", "Amherst", "Astoria", "Binghamton", "Bronx", "Brooklyn",
    "Buffalo", "Cheektowaga", "Hempstead", "Huntington", "Jamaica", "Long Island",
    "Mount Vernon", "New Rochelle", "New York", "Niagara Falls", "Queens",
    "Rochester", "Schenectady", "Staten Island", "Syracuse", "Tonawanda",
    "Utica", "White Plains", "Yonkers",
  ],
  NC: [
    "Asheville", "Cary", "Chapel Hill", "Charlotte", "Concord", "Durham",
    "Fayetteville", "Gastonia", "Greensboro", "Greenville", "Hickory",
    "High Point", "Jacksonville", "Kannapolis", "Raleigh", "Rocky Mount",
    "Wilmington", "Winston-Salem",
  ],
  ND: ["Bismarck", "Dickinson", "Fargo", "Grand Forks", "Minot", "Williston"],
  OH: [
    "Akron", "Canton", "Cincinnati", "Cleveland", "Columbus", "Dayton", "Elyria",
    "Euclid", "Hamilton", "Kettering", "Lakewood", "Lorain", "Mansfield",
    "Mentor", "Middletown", "Newark", "Parma", "Springfield", "Toledo", "Youngstown",
  ],
  OK: [
    "Broken Arrow", "Edmond", "Enid", "Lawton", "Midwest City", "Moore",
    "Norman", "Oklahoma City", "Stillwater", "Tulsa",
  ],
  OR: [
    "Albany", "Beaverton", "Bend", "Corvallis", "Eugene", "Gresham", "Hillsboro",
    "Lake Oswego", "McMinnville", "Medford", "Portland", "Salem", "Springfield",
    "Tigard",
  ],
  PA: [
    "Allentown", "Altoona", "Bethlehem", "Chester", "Easton", "Erie",
    "Harrisburg", "Lancaster", "Levittown", "Philadelphia", "Pittsburgh",
    "Reading", "Scranton", "State College", "Wilkes-Barre", "York",
  ],
  RI: ["Cranston", "East Providence", "Newport", "Pawtucket", "Providence", "Warwick", "Woonsocket"],
  SC: ["Charleston", "Columbia", "Florence", "Greenville", "Hilton Head Island", "Mount Pleasant", "Myrtle Beach", "North Charleston", "Rock Hill", "Spartanburg", "Summerville"],
  SD: ["Aberdeen", "Brookings", "Pierre", "Rapid City", "Sioux Falls", "Watertown"],
  TN: [
    "Bartlett", "Brentwood", "Chattanooga", "Clarksville", "Cleveland", "Collierville",
    "Columbia", "Cookeville", "Franklin", "Germantown", "Hendersonville",
    "Jackson", "Johnson City", "Kingsport", "Knoxville", "Memphis", "Murfreesboro",
    "Nashville", "Smyrna", "Spring Hill",
  ],
  TX: [
    "Abilene", "Allen", "Amarillo", "Arlington", "Austin", "Baytown", "Beaumont",
    "Brownsville", "Bryan", "Carrollton", "College Station", "Corpus Christi",
    "Dallas", "Denton", "Edinburg", "El Paso", "Fort Worth", "Frisco",
    "Galveston", "Garland", "Grand Prairie", "Harlingen", "Houston", "Irving",
    "Killeen", "Laredo", "League City", "Lewisville", "Longview", "Lubbock",
    "McAllen", "McKinney", "Mesquite", "Midland", "Mission", "Missouri City",
    "North Richland Hills", "Odessa", "Pasadena", "Pharr", "Plano", "Richardson",
    "Round Rock", "San Angelo", "San Antonio", "San Marcos", "Sugar Land",
    "Temple", "Tyler", "Victoria", "Waco", "Wichita Falls",
  ],
  UT: ["Layton", "Lehi", "Logan", "Murray", "Ogden", "Orem", "Provo", "Salt Lake City", "Sandy", "South Jordan", "St. George", "Taylorsville", "West Jordan", "West Valley City"],
  VT: ["Burlington", "Essex", "Montpelier", "Rutland", "South Burlington"],
  VA: [
    "Alexandria", "Arlington", "Charlottesville", "Chesapeake", "Danville",
    "Fairfax", "Falls Church", "Fredericksburg", "Hampton", "Harrisonburg",
    "Leesburg", "Lynchburg", "Manassas", "Newport News", "Norfolk", "Petersburg",
    "Portsmouth", "Reston", "Richmond", "Roanoke", "Springfield", "Staunton",
    "Suffolk", "Virginia Beach", "Winchester",
  ],
  WA: [
    "Auburn", "Bellevue", "Bellingham", "Bothell", "Bremerton", "Burien",
    "Everett", "Federal Way", "Kennewick", "Kent", "Kirkland", "Lacey",
    "Lakewood", "Marysville", "Olympia", "Pasco", "Pullman", "Puyallup",
    "Renton", "Seattle", "Shoreline", "Spokane", "Spokane Valley", "Tacoma",
    "University Place", "Vancouver", "Walla Walla", "Wenatchee", "Yakima",
  ],
  WV: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
  WI: [
    "Appleton", "Beloit", "Brookfield", "Eau Claire", "Fond du Lac", "Green Bay",
    "Janesville", "Kenosha", "La Crosse", "Madison", "Milwaukee", "Oshkosh",
    "Racine", "Sheboygan", "Waukesha", "Wausau", "Wauwatosa", "West Allis",
  ],
  WY: ["Casper", "Cheyenne", "Cody", "Evanston", "Gillette", "Laramie", "Rock Springs", "Sheridan"],
};

export const findStateByName = (nameOrCode) => {
  if (!nameOrCode) return null;
  const needle = String(nameOrCode).trim().toLowerCase();
  return (
    US_STATES.find(
      (state) =>
        state.code.toLowerCase() === needle ||
        state.name.toLowerCase() === needle
    ) || null
  );
};

export const getCitiesForState = (stateNameOrCode) => {
  const state = findStateByName(stateNameOrCode);
  if (!state) return [];
  return US_CITIES_BY_STATE[state.code] || [];
};

export const filterStates = (query) => {
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return US_STATES;
  return US_STATES.filter(
    (state) =>
      state.name.toLowerCase().includes(needle) ||
      state.code.toLowerCase().includes(needle)
  );
};

export const filterCities = (stateNameOrCode, query) => {
  const cities = getCitiesForState(stateNameOrCode);
  const needle = String(query || "").trim().toLowerCase();
  if (!needle) return cities;
  return cities.filter((city) => city.toLowerCase().includes(needle));
};
