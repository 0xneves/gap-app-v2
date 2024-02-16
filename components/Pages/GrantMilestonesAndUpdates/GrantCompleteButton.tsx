"use client";

import { useOwnerStore, useProjectStore } from "@/store";
import { PAGES } from "@/utilities";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import type { Grant, Project } from "@show-karma/karma-gap-sdk";
import Link from "next/link";
import type { FC } from "react";

interface GrantCompleteProps {
  project: Project;
  grant: Grant;
  text?: string;
}

export const GrantCompleteButton: FC<GrantCompleteProps> = ({
  grant,
  project,
  text = "Mark as Complete",
}) => {
  const isOwner = useOwnerStore((state) => state.isOwner);
  const isProjectOwner = useProjectStore((state) => state.isProjectOwner);
  const isAuthorized = isOwner || isProjectOwner;
  if (grant.completed) {
    return (
      <div className="flex flex-row items-center  justify-center gap-2 rounded-md border border-emerald-600 bg-green-100 px-3.5 py-2 text-sm font-semibold text-emerald-700 hover:bg-green-100">
        Grant marked as complete
        <div className="h-5 w-5">
          <CheckCircleIcon className="h-5 w-5" />
        </div>
      </div>
    );
  }
  if (!isAuthorized || !project) return null;
  return (
    <Link
      href={PAGES.PROJECT.TABS.SELECTED_TAB(
        project.uid,
        grant.uid,
        "complete-grant"
      )}
      className="hover:opacity-75 flex flex-row items-center justify-center gap-2 rounded-md  bg-[#17B26A] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#17B26A]"
    >
      {text}
      <div className="h-5 w-5">
        <CheckCircleIcon className="h-5 w-5" />
      </div>
    </Link>
  );
};
