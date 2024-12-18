// Internal constants
const MAX_POINTS = 999999999999999;
const POINT_SCALE = {
  T: 1000000000000,
  B: 1000000000,
  M: 1000000,
  K: 1000,
};

function parseCoordinate(coordsign, coordWhole, coordFrac) {
  const sign = coordsign === 'M' ? -1 : 1;
  return sign * parseFloat(coordWhole + '.' + coordFrac);
}

function formatCoordinateParts(coord) {
  const sign = coord < 0 ? 'M' : 'P';
  const absCoord = Math.abs(coord);
  const whole = String(Math.floor(absCoord)).padStart(3, '0');
  const frac = String(absCoord % 1).substring(2).padEnd(18, '0').slice(0, 18);

  return { sign, whole, frac };
}

function formatPoints(pointsCount) {
  const scale = Object.keys(POINT_SCALE).find((x) => pointsCount >= POINT_SCALE[x]);
  if (!scale || pointsCount > MAX_POINTS) throw new Error('Invalid points count');
  const count = String(Math.floor(pointsCount / POINT_SCALE[scale])).padStart(3, '0');

  return { count, scale };
}

// Exported functions
export function parseScalePoints(scale, number) {
  if (!POINT_SCALE[scale]) throw new Error('Invalid points scale');
  return parseInt(number, 10) * POINT_SCALE[scale];
}

export function validateLocationId(id) {
  const regex = /^([A-Z]{2})([PM]\d{3}){2}(\d{18}){2}([BTMK]\d{3})$/;
  return regex.test(id);
}

export function parseLocationId(id) {
  if (!validateLocationId(id)) throw new Error('Invalid Id');

  const country = id.substring(0, 2);
  const lat = parseCoordinate(id.substring(2, 3), id.substring(3, 6), id.substring(10, 28));
  const lng = parseCoordinate(id.substring(6, 7), id.substring(7, 10), id.substring(28, 46));
  const points = parseScalePoints(id.substring(46, 47), id.substring(47, 50));

  return { country, lat, lng, points };
}

export function generateLocationId(country, lat, lng, pointsCount) {
  const latParts = formatCoordinateParts(lat);
  const lngParts = formatCoordinateParts(lng);
  const points = formatPoints(pointsCount);

  return (
    `${country}` +
    `${latParts.sign}${latParts.whole}` +
    `${lngParts.sign}${lngParts.whole}` +
    `${latParts.frac}` +
    `${lngParts.frac}` +
    `${points.scale}${points.count}`
  );
}