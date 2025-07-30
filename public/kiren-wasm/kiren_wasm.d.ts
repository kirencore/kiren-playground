/* tslint:disable */
/* eslint-disable */
export function init(): void;
export function init_kiren(): Promise<any>;
export function get_version(): string;
export function supports_modules(): boolean;
export function supports_async(): boolean;
export function supports_fetch(): boolean;
export function benchmark_execution(code: string, iterations: number): Promise<any>;
export class KirenRuntime {
  free(): void;
  constructor();
  /**
   * Execute JavaScript code synchronously - Ultra safe version with console capture
   */
  execute(code: string): string;
  /**
   * Execute JavaScript code asynchronously
   */
  execute_async(code: string): Promise<any>;
  /**
   * Execute ES6 module
   */
  execute_module(code: string, _module_url: string): string;
  /**
   * Get runtime version
   */
  version(): string;
  /**
   * Get runtime statistics - Safe version
   */
  stats(): string;
  /**
   * Clear runtime state
   */
  clear(): void;
  /**
   * Set runtime options
   */
  set_options(_options: any): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_kirenruntime_free: (a: number, b: number) => void;
  readonly kirenruntime_new: () => number;
  readonly kirenruntime_execute: (a: number, b: number, c: number, d: number) => void;
  readonly kirenruntime_execute_async: (a: number, b: number, c: number) => number;
  readonly kirenruntime_execute_module: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  readonly kirenruntime_version: (a: number, b: number) => void;
  readonly kirenruntime_stats: (a: number, b: number) => void;
  readonly kirenruntime_clear: (a: number) => void;
  readonly kirenruntime_set_options: (a: number, b: number) => void;
  readonly init_kiren: () => number;
  readonly get_version: (a: number) => void;
  readonly supports_async: () => number;
  readonly supports_fetch: () => number;
  readonly benchmark_execution: (a: number, b: number, c: number) => number;
  readonly init: () => void;
  readonly supports_modules: () => number;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number) => number;
  readonly __wbindgen_export_3: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_export_5: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_6: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
