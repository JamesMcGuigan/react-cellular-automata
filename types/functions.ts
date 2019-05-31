export function isArrayOfNumber( data: any ): data is Array<number> {
    return Array.isArray(data)
        && !data.some((value) => isNaN(value))
    ;
}

export function isArrayArrayOfNumber( data: any ): data is Array<Array<number>> {
    return Array.isArray(data)
        && data.every((value) => isArrayOfNumber(value))
    ;
}
