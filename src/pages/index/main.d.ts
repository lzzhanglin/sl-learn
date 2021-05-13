type DataType = {
    data: any,
    msg: string,
    status: number,
}

export interface AxiosRespType {
    data: DataType,
    config: object,
    headers: object,
    request: object,
    status: number,
    statusText: string,
}