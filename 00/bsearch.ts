

// 8:40 8:58

function search(a: number[], v: number): number {
  function go(from: number, to: number): number {
    if (from > to) return -1
    const mid = Math.floor((from + to) / 2)
    if (a[mid] == v) return mid
    return (a[mid] > v) ? go(from, mid-1) : go(mid + 1, to)
  }
  return go(0, a.length-1)
}

console.log(search([1,4,6,33,72], 4))
