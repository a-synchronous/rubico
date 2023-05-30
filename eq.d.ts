export declare function eq<L extends (...args: any) => any, R extends (...args: any) => any>(
  left: L,
  right: R
): (...arg: Parameters<L> | Parameters<R>) => boolean;
export declare function eq<L extends (...args: any) => any, R>(left: L, right: R): (...arg: Parameters<L>) => boolean;
export declare function eq<L, R extends (...args: any) => any>(left: L, right: R): (...arg: Parameters<R>) => boolean;

export declare function eq<L, R>(left: L, right: R): boolean;
