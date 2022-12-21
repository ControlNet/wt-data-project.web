use std::panic;

use js_sys::{Float32Array, Uint32Array, Uint8Array};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {}

#[wasm_bindgen]
pub fn extract_data(
    data_cls: &Uint8Array,
    data_nation: &Uint8Array,
    data_br: &Float32Array,
    selected_nation: &Uint8Array,
    selected_br: &Float32Array,
    clazz: u8,
) -> Uint32Array {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let mut filtered_indexes: Vec<u32> = Vec::new();
    for i in 0..data_cls.length() {
        let row_clazz = data_cls.get_index(i);
        let row_nation = data_nation.get_index(i);
        let row_br = data_br.get_index(i);
        if row_clazz == clazz {
            let mut ok = false;
            for j in 0..selected_nation.length() {
                let info_nation = selected_nation.get_index(j);
                let info_br = selected_br.get_index(j);
                if info_nation == row_nation && info_br == row_br {
                    ok = true;
                }
            }
            if ok {
                filtered_indexes.push(i);
            }
        }
    }
    return Uint32Array::from(&filtered_indexes[..]);
}
