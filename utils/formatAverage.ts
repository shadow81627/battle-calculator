export default function formatAverage(number: number) {
  if (number % 1 === 0) return number;
  const rounded = Math.round((number + Number.EPSILON) * 100) / 100;
  return Number(rounded).toFixed(2);
}
