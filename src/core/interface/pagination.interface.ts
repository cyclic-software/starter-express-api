export default interface IPagination<item> {
    total: number,
    page: number,
    pageSize: number,
    items: item[]
}