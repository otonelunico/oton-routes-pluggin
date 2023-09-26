export enum RouterMethods {
    POST = "post",
    GET = "get",
    DELETE = 'delete'
}

export interface ObjRoutes { 
    path: string, 
    routers: ObjRoute[]
}

export interface ObjRoute {
    name?: string,
    method: RouterMethods,
    path: string,
    controller: Function
}

interface Request {[key:string]: any}

interface Response {[key:string]: any}

interface Express {[key:string]: any}



const urls = global.urls || {};
const routers: ObjRoutes[] = [];

export const dev = (flag: boolean): void => {
    if(!flag) return;
    const name = 'test.urls';
    register({
        path: "/test",
        routers: [{
            name,
            method: RouterMethods.GET,
            path: '/urls',
            controller: (req: Request, res: Response) => {
                let data:any = {}
                Object.entries(urls).forEach(([key, value]) => {
                    if(key == name) return;
                    const p = key.split('.')[0];
                    const h = key.split('.')[1];
                    if(!data[p]) data[p] = {};
                    if(!h) return data[p] = value;
                    data[p][h] = value;
                })
                delete urls[name]; 
                return res.status(200).json({
                    success: true,
                    message: "successful",
                    data, 
                    urls
                });
            }
        }]
    })
}


export const register = (routes: ObjRoutes): void => {
    routers.push(routes)
}

export default (app: Express, prefix: string, stage?: string) => {
    routers.forEach((r) => {
        Object.values(r.routers).forEach((e) => {
            let path = (prefix + r.path + e.path)
                .replace('//', '/')
                .replace("*", (stage || '*').toLowerCase());
            app[e.method](path, e.controller as any); 
            e.name && (urls[e.name] = {
                path, 
                method: e.method, 
                controller: e.controller.toString().split('(')?.[0] || undefined
            });
        })
    });
    global.urls = urls;
    return;
}
