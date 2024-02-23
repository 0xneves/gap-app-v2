/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { ProjectPageLayout } from ".";
import {
  INDEXER,
  PAGES,
  defaultMetadata,
  getMetadata,
  shortAddress,
  zeroUID,
} from "@/utilities";
import { blo } from "blo";
import { useOwnerStore, useProjectStore } from "@/store";
import { Hex } from "viem";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { IProjectDetails } from "@show-karma/karma-gap-sdk";
import { NextSeo } from "next-seo";
import { ProjectSubscription } from "@/components/ProjectSubscription";
import fetchData from "@/utilities/fetchData";
import { Spinner } from "@/components/Utilities/Spinner";
import { useRouter } from "next/router";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { params } = context;
  const projectId = params?.projectId as string;

  const projectInfo = await getMetadata<IProjectDetails>(
    "projects",
    projectId as Hex
  );

  if (projectInfo?.uid === zeroUID || !projectInfo) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      projectTitle: projectInfo?.title || "",
      projectDesc: projectInfo?.description?.substring(0, 80) || "",
    },
  };
}
const ContactInfoPage = ({
  projectTitle,
  projectDesc,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const dynamicMetadata = {
    title: `Karma GAP - ${projectTitle}`,
    description: projectDesc,
  };
  const contactInfo = useProjectStore((state) => state.projectContactInfo);
  const contactInfoLoading = useProjectStore(
    (state) => state.contactInfoLoading
  );

  return (
    <>
      <NextSeo
        title={dynamicMetadata.title || defaultMetadata.title}
        description={dynamicMetadata.description || defaultMetadata.description}
        twitter={{
          handle: defaultMetadata.twitter.creator,
          site: defaultMetadata.twitter.site,
          cardType: "summary_large_image",
        }}
        openGraph={{
          url: defaultMetadata.openGraph.url,
          title: dynamicMetadata.title || defaultMetadata.title,
          description:
            dynamicMetadata.description || defaultMetadata.description,
          images: defaultMetadata.openGraph.images.map((image) => ({
            url: image,
            alt: dynamicMetadata.title || defaultMetadata.title,
          })),
          site_name: defaultMetadata.openGraph.siteName,
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.png",
          },
        ]}
      />
      <div className="pt-5 pb-20">
        {contactInfoLoading ? (
          <Spinner />
        ) : (
          <ProjectSubscription contactInfo={contactInfo} />
        )}
      </div>
    </>
  );
};

ContactInfoPage.getLayout = ProjectPageLayout;

export default ContactInfoPage;
