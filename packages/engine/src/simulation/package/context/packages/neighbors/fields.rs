use super::*;
use crate::datastore::schema::{
    FieldScope, FieldType, FieldTypeVariant::*, PresetFieldType, RootFieldSpec,
};

fn neighbors() -> FieldType {
    let variant = VariableLengthArray(Box::new(FieldType::new(
        FixedLengthArray {
            kind: Box::new(FieldType::new(Preset(PresetFieldType::UInt32), false)),
            len: NEIGHBOR_INDEX_COUNT,
        },
        false,
    )));
    FieldType::new(variant, false)
}

pub(super) fn get_neighbors_field_spec(
    field_spec_creator: &RootFieldSpecCreator,
) -> Result<RootFieldSpec> {
    let neighbors = neighbors();
    Ok(field_spec_creator.create("neighbors".into(), neighbors, FieldScope::Agent))
}

pub(super) fn get_search_radius_field_spec(
    field_spec_creator: &RootFieldSpecCreator,
) -> Result<RootFieldSpec> {
    let search_radius = FieldType::new(Number, true);
    Ok(field_spec_creator.create(
        "search_radius".to_string(),
        search_radius,
        FieldScope::Agent,
    ))
}
