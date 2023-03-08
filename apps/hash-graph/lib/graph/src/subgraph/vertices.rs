use std::{
    collections::{
        hash_map::{RandomState, RawEntryMut},
        HashMap,
    },
    hash::Hash,
};

use crate::{
    knowledge::Entity,
    ontology::{DataTypeWithMetadata, EntityTypeWithMetadata, PropertyTypeWithMetadata},
    store::Record,
    subgraph::identifier::{EntityVertexId, GraphElementVertexId, OntologyTypeVertexId},
};

#[derive(Default, Debug)]
pub struct Vertices {
    pub data_types: HashMap<OntologyTypeVertexId, DataTypeWithMetadata>,
    pub property_types: HashMap<OntologyTypeVertexId, PropertyTypeWithMetadata>,
    pub entity_types: HashMap<OntologyTypeVertexId, EntityTypeWithMetadata>,
    pub entities: HashMap<EntityVertexId, Entity>,
}

/// Used for index operations on the [`Vertices`] on a [`Subgraph`].
///
/// Depending on `R`, the index operation will be performed on the respective collection of the
/// subgraph.
///
/// [`Subgraph`]: crate::subgraph::Subgraph
pub trait VertexIndex<R: Record>: Clone + Eq + Hash + Into<GraphElementVertexId> {
    /// Returns a shared reference to the [`Record`] vertex in the subgraph.
    fn vertices_entry<'a>(&self, vertices: &'a Vertices) -> Option<&'a R>;

    /// Returns a mutable reference to the [`Record`] vertex in the subgraph.
    fn vertices_entry_mut<'a>(
        &self,
        vertices: &'a mut Vertices,
    ) -> RawEntryMut<'a, R::VertexId, R, RandomState>;
}
