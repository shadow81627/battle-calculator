export default function occurrences(list: number[]) {
  const initial: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  };
  return list.sort().reduce((acc, curr) => {
    acc[curr] ? ++acc[curr] : (acc[curr] = 1);
    return acc;
  }, initial);
}
