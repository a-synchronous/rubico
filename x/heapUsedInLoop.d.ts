export = heapUsedInLoop;
/**
 * @name heapUsedInLoop
 *
 * @catchphrase
 * max and avg heap used in loop
 *
 * @synopsis
 * heapUsedInLoop(
 *   desc string,
 *   loopCount number,
 *   func (loop number)=>any
 * ) -> ()
 *
 * @description
 * **heapUsedInLoop** is a memory usage measurement function. Supply `description`, `loopCount`, and a function `func` for that function to be run `loopCount` times, finally logging average and max heap used per loop in terms of megabytes MiB.
 *
 * ```javascript
 * heapUsedInLoop('my-description', 1e5, function () {
 *   return 1 + 1
 * }) /*
 * 0 5.88 MiB
 * 1 5.92 MiB
 * ...
 * 99997 7.34 MiB
 * 99998 7.34 MiB
 * 99999 7.35 MiB
 * my-description: 1e+5: {
 *   "max": "7.15 MiB",
 *   "avg": "5.50 MiB"
 * }
 * ```
 *
 * @node-only
 */
declare function heapUsedInLoop(desc: any, loopCount: any, func: any): void;
declare namespace heapUsedInLoop {
    function skip(): void;
    /**
     * @name heapUsedInLoop.async
     *
     * @synopsis
     * heapUsedInLoop.async(
     *   desc string,
     *   loopCount number,
     *   func (loop number)=>Promise|any
     * ) -> ()
     */
    function async(desc: any, loopCount: any, func: any): Promise<void>;
    namespace async {
        function skip(): void;
    }
}
