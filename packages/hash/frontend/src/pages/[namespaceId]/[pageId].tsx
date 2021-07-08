import { VoidFunctionComponent } from "react";

import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { getPageQuery } from "../../graphql/queries/page.queries";
import {
  GetPageQuery,
  GetPageQueryVariables,
} from "../../graphql/autoGeneratedTypes";
import { PageBlock } from "../../blocks/page/PageBlock";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  BlockMeta,
  BlockWithoutMeta,
  fetchBlockMeta,
} from "../../blocks/page/tsUtils";
import { PageSidebar } from "../../components/layout/PageSidebar/PageSidebar";

import styles from "../index.module.scss";

const preloadedBlocksUrls = ["https://block.blockprotocol.org/paragraph"];

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const preloadedBlockMeta = await Promise.all(
    preloadedBlocksUrls?.map((url) => fetchBlockMeta(url)) ?? []
  );

  return { props: { preloadedBlockMeta } };
};

export const Page: VoidFunctionComponent<{ preloadedBlockMeta: BlockMeta[] }> =
  ({ preloadedBlockMeta }) => {
    const { query } = useRouter();

    const pageId = query.pageId as string;
    const namespaceId = query.namespaceId as string;

    const { data, error, loading } = useQuery<
      GetPageQuery,
      GetPageQueryVariables
    >(getPageQuery, {
      variables: { pageId, namespaceId },
    });

    if (loading) {
      return <h1>Loading...</h1>;
    }
    if (error) {
      return <h1>Error: {error.message}</h1>;
    }
    if (!data) {
      return <h1>No data loaded.</h1>;
    }

    const { title, contents } = data.page.properties;

    // @todo this mapping should probably be done in PageBlock
    const mappedContents = contents.map((content): BlockWithoutMeta => {
      const { componentId, entity } = content.properties;

      // @todo multiple text children
      const props =
        entity.__typename === "Text"
          ? {
              childEntityId: entity.id,
              childEntityNamespaceId: entity.namespaceId,
              children: entity.textProperties.texts.map((text) => ({
                type: "text",
                text: text.text,
                entityId: entity.id,
                namespaceId: entity.namespaceId,
                marks: [
                  ["strong", text.bold],
                  ["underlined", text.underline],
                  ["em", text.italics],
                ]
                  .filter(([, include]) => include)
                  .map(([mark]) => mark),
              })),
            }
          : entity.__typename === "UnknownEntity"
          ? entity.unknownProperties
          : {};

      return {
        componentId,
        entityId: content.id,
        entity: props,
        namespaceId: content.namespaceId,
      };
    });

    const preloadedBlocks = new Map(
      preloadedBlockMeta.map(
        (node) => [node.componentMetadata.url, node] as const
      )
    );

    console.log({ mappedContents });

    return (
      <div className={styles.MainWrapper}>
        <PageSidebar />
        <div className={styles.MainContent}>
          <header>
            <h1>{title}</h1>
          </header>

          <main>
            <PageBlock
              pageId={pageId}
              namespaceId={data.page.namespaceId}
              contents={mappedContents}
              blocksMeta={preloadedBlocks}
            />
          </main>
        </div>
      </div>
    );
  };

export default Page;
