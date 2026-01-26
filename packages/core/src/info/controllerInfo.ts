import 'reflect-metadata';
import { TControllerInfo, TMethodInfo, TPath, THelper } from '../types/TControllerInfo';

const METADATA_KEY = 'uma:controller';
// Internal registry to keep track of controller classes
const ControllerRegistry: Set<Function> = new Set();

export default class ControllerInfo {
    /**
     * Set or update controller metadata
     * This method is called by decorators (@Path, @GET, @POST, etc.) to register controller information.
     *
     * @param clazz The controller class constructor
     * @param methodName The name of the method being decorated (if applicable)
     * @param info Configuration object containing path, method types, and argument decorators
     */
    static setControllersInfo(clazz: Function, methodName: string, info: THelper = {}) {
        // Retrieve existing metadata or create new
        const clazzInfo: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz) || { methodMap: new Map() };

        // Register class to the internal registry so we can iterate over it later
        ControllerRegistry.add(clazz);

        /**
         * Extract fields that need to be set or updated
         * rootPath: The base path for the controller (from class-level @Path)
         * path: The sub-path for a specific method (from method-level @Path/HTTP decorators)
         * methodTypes: HTTP methods (GET, POST, etc.) allowed for this route
         * argDecorator: Argument decorator function (for @Query, @Body, etc.)
         */
        const { rootPath, path, methodTypes = [], argProps, argIndex, argDecorator } = info;
        const { methodMap } = clazzInfo;

        if (rootPath) clazzInfo.path = rootPath;

        if (methodName) {
            const methodInfo: TMethodInfo = methodMap.get(methodName) || {
                args: [],
                paths: [],
            };

            methodInfo.name = methodName;

            // Register route path and HTTP methods
            if (path) {
                const pathObj: TPath = { path };

                if (methodTypes.length > 0) pathObj.methodTypes = methodTypes;

                methodInfo.paths.push(pathObj);
            }

            // Register argument decorator
            if (argDecorator) {
                methodInfo.args.push({
                    argDecorator,
                    argProps,
                    argIndex,
                });
            }

            methodMap.set(methodName, methodInfo);
        }

        // Update controller info metadata on the class
        clazzInfo.clazz = clazz;
        Reflect.defineMetadata(METADATA_KEY, clazzInfo, clazz);
    }

    /**
     * Get metadata for all registered controllers
     * Used by the Router to build the routing table.
     *
     * @returns An array of TControllerInfo containing paths, methods, and other metadata
     */
    static getControllersInfo(): TControllerInfo[] {
        const controllersInfo: TControllerInfo[] = [];

        for (const clazz of ControllerRegistry) {
            const info: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz);

            if (info) controllersInfo.push(info);
        }

        return controllersInfo;
    }

    /**
     * Get metadata for a specific controller class
     *
     * @param clazz The controller class
     * @returns The controller metadata or undefined if not found
     */
    static get(clazz: Function): TControllerInfo | undefined {
        return Reflect.getMetadata(METADATA_KEY, clazz);
    }

    /**
     * Check if a method is a registered aspect/route handler
     *
     * @param clazz The controller class
     * @param method The method name to check
     * @returns True if the method is registered in the controller's metadata
     */
    static isAspectMethod(clazz: Function, method: string): boolean {
        const info: TControllerInfo = Reflect.getMetadata(METADATA_KEY, clazz);

        if (!info) return false;

        return info.methodMap.has(method);
    }
}
