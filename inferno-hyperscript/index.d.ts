import { InfernoNode, VNode } from 'inferno';
/**
 * Creates virtual node
 * @param {string|VNode|Function} _tag Name for virtual node
 * @param {object=} _props Additional properties for virtual node
 * @param {string|number|VNode|Array<string|number|VNode>|null=} _children Optional children for virtual node
 * @returns {VNode} returns new virtual node
 */
export declare function h(_tag: string | VNode | Function, _props?: any, _children?: InfernoNode): VNode;
