export = streamExtend;
/**
 * @name streamExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream = { read: function, write: function }
 *
 * streamExtend<
 *   stream Stream,
 *   values Stream|any,
 * >(stream, values) -> Promise|stream
 * ```
 *
 * @TODO maybe support `.read`
 */
declare function streamExtend(stream: any, values: any): any;
