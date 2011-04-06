/**
 * @interface
 * @description Interface for a double ended queue.
 * <ul>
 *   <li>pushHead</li>
 *   <li>pushTail</li>
 *   <li>popHead</li>
 *   <li>popTail</li>
 *   <li>getHeadData</li>
 *   <li>getTailData</li>
 * </ul>
 */
kiso.data.IDeque = kiso.Interface([
	'pushHead',
	'pushTail',
	'popHead',
	'popTail',
	'getHeadData',
	'getTailData'
]);
