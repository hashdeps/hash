import { VersionedUrl } from "@blockprotocol/type-system/slim";
import { MockBlockDock } from "mock-block-dock";
import { createRoot } from "react-dom/client";

import packageJSON from "../package.json";
import Component from "./index";
import { RootEntity } from "./types";

const node = document.getElementById("app");

const blockEntity: RootEntity = {
  metadata: {
    recordId: {
      entityId: "block-entity",
      editionId: new Date().toISOString(),
    },
    entityTypeId: packageJSON.blockprotocol.schema as VersionedUrl,
  },
  properties: {},
} as const;

/**
 * This is an embedding application for local development and debugging.
 * It is the application loaded into the browser when you run 'yarn dev' (or 'npm run dev')
 * No data from it will be published with your block or included as part of a production build.
 *
 * The component used here, 'MockBlockDock', does the following:
 * 1. It renders your block on the page and provides the initial properties specified below
 * 2. It holds an in-memory datastore of entities and links
 * 3. It listens for messages from your blocks and updates its datastore appropriately (e.g. to create a new entity)
 * 4. It displays a debug UI allowing you to see the contents of its datastore, and messages sent back and forth
 */
const DevApp = () => {
  return (
    <MockBlockDock
      blockDefinition={{ ReactComponent: Component }}
      blockInfo={packageJSON.blockprotocol}
      debug
      initialData={{
        initialEntities: [blockEntity],
      }}
      simulateDatastoreLatency={{
        // configure this to adjust the range of artificial latency in responses to datastore-related requests (in ms)
        min: 50,
        max: 200,
      }}
      blockProtocolApiKey={process.env.BP_API_KEY}
      blockProtocolSiteHost={process.env.BP_HOST ?? "https://blockprotocol.org"} // update this to a recent staging deployment when testing
      // includeDefaultMockData // this seeds the datastore with sample entities and links, remove this to start with just the contents of `initialData`
      // hideDebugToggle <- uncomment this to disable the debug UI entirely
      // initialEntities={[]} <- customise the entities in the datastore (blockEntity is always added, if you provide it)
      // initialEntityTypes={[]} <- customise the entity types in the datastore
      // initialLinks={[]} <- customise the links in the datastore
      // initialLinkedQueries={[]} <- customise the linkedQueries in the datastore
      // readonly <- uncomment this to start your block in readonly mode. You can also toggle it in the UI
    />
  );
};

if (node) {
  createRoot(node).render(<DevApp />);
} else {
  throw new Error("Unable to find DOM element with id 'app'");
}
