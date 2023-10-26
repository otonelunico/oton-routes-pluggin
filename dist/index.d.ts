export declare enum RouterMethods {
    POST = "post",
    GET = "get",
    DELETE = "delete",
    PUT = "put"
}
export interface ObjRoutes {
    path: string;
    routers: ObjRoute[];
}
export interface ObjRoute {
    name?: string;
    method: RouterMethods;
    path: string;
    controller: Function;
}
interface Express {
    [key: string]: any;
}
export declare const dev: (flag: boolean) => void;
export declare const register: (routes: ObjRoutes) => void;
declare const _default: (app: Express, prefix: string, stage?: string) => void;
export default _default;
