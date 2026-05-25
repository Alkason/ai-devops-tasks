function findPairsOptimized(arr, targetSum) {
  const pairs = [];
  const seenNumbers = new Set();

  for (const num of arr) {
    const complement = targetSum - num;

    if (seenNumbers.has(complement)) {
      pairs.push([complement, num]);
    }
    
    seenNumbers.add(num);
  }

  return pairs;
}