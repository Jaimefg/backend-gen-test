export type HTTP_METHOD = "get" | "post" | "put" | "delete" | "patch" | "options"
export interface Route {
    method: HTTP_METHOD;
    path: string;
    controller: Function;
}