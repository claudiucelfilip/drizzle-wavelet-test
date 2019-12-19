use smart_contract::log;
use schemars::{schema_for, JsonSchema};
use serde::{Deserialize, Serialize};
use smart_contract::payload::Parameters;
use smart_contract::transaction::{Transaction, Transfer};
use smart_contract_macros::smart_contract;

#[derive(Deserialize, JsonSchema)]
struct SetDataParams {
    data: String
}

#[derive(Deserialize, JsonSchema)]
struct GetDataParams {}

#[derive(Deserialize, JsonSchema)]
struct ParamSchema {
    get_data: GetDataParams,
    set_data: SetDataParams
}

#[derive(Deserialize, JsonSchema)]
pub struct Contract {
    pub data: String
}

#[smart_contract]
impl Contract {
    fn init(_params: &mut Parameters) -> Self {
        let data = "";
        Self { data: data.to_string() }
    }

    fn get_schema(&mut self, params: &mut Parameters) -> Result<(), String> {
        log(&serde_json::to_string(&schema_for!(Contract).unwrap()).unwrap());
        log(&serde_json::to_string(&schema_for!(ParamSchema).unwrap()).unwrap());
        Ok(())
    }

    fn set_data(&mut self, params: &mut Parameters) -> Result<(), String> {
        let json_params: String = params.read();
        let json_params: SetDataParams = serde_json::from_str(&json_params).unwrap();

        self.data = json_params.data;
        Ok(())
    }

    fn get_data(&mut self, _params: &mut Parameters) -> Result<(), String> {
        log(&self.data);
        Ok(())
    }
}