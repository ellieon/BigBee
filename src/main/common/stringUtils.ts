export function format (input: string, ...args: string[]): string {
  return input.replace(/{(\d+)}/g, function (match, index) {
    return typeof args[index] !== undefined
      ? args[index]
      : match
  })
}
