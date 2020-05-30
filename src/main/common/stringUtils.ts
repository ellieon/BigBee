export function format(string: string, ...args: string[]): string{
        return string.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != undefined
                ? args[number]
                : match
        })
    }