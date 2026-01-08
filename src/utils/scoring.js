export const calculateScore = (original, spoken) => {
  const o = original.toLowerCase().split(" ");
  const s = spoken.toLowerCase().split(" ");

  let match = 0;
  o.forEach(w => s.includes(w) && match++);

  const accuracy = (match / o.length) * 100;

  return {
    total: Math.min(Math.round((accuracy / 100) * 15), 15),
    accuracy: Math.round(accuracy)
  };
};
