export = NextIteration;
/**
 * @name NextIteration
 *
 * @synopsis
 * NextIteration(value any) -> nextIteration { value, done: false }
 *
 * @description
 * Create an object to send for the next iteration
 */
declare function NextIteration(value: any): {
    value: any;
    done: boolean;
};
