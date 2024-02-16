/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { Project } from "@show-karma/karma-gap-sdk";
import Link from "next/link";

import { Spinner } from "../Utilities/Spinner";
import EthereumAddressToENSName from "../EthereumAddressToENSName";
import { PAGES } from "@/utilities";
import { blo } from "blo";

interface Props {
  data: Project[]; // Will be modular in the future
  isOpen: boolean;
  isLoading: boolean;
}

export const SearchList: React.FC<Props> = ({
  data = [],
  isOpen = false,
  isLoading = true,
}) => {
  const triggerCreateProjectModal = () => {
    const el = document?.getElementById("new-project-button");
    if (el) el.click();
  };

  return (
    isOpen && (
      <div className="absolute left-0 top-10 mt-3 max-h-64 min-w-full overflow-y-auto rounded-md bg-white dark:bg-zinc-800 py-4 shadow-md">
        {data.length > 0 &&
          data.map((project) => (
            <Link
              key={project.uid}
              href={PAGES.PROJECT.GRANTS(project.details?.slug || project.uid)}
            >
              <div className=":last:border-b-0 cursor-pointer select-none border-b border-slate-100 px-4 py-2 transition hover:bg-slate-200 dark:hover:bg-zinc-700">
                <b className="max-w-full text-ellipsis font-bold text-black dark:text-zinc-100">
                  {project.details?.title}
                </b>
                <br />
                <div className="text-gray-500 dark:text-gray-200">
                  <div className="mt-3 flex items-center">
                    <small className="mr-2">By</small>
                    <div className="flex flex-row gap-1 items-center font-medium">
                      <img
                        src={blo(project.recipient)}
                        className="w-4 h-4 rounded-full"
                        alt="Recipient's Profile Picture"
                      />
                      <EthereumAddressToENSName address={project.recipient} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}

        {isLoading && (
          <div className="flex justify-center ">
            <Spinner />
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="flex flex-col items-center text-center">
            <div className="w-full text-center">No results found.</div>
            <div
              onClick={() => triggerCreateProjectModal()}
              className="mt-2 cursor-pointer rounded-sm bg-brand-blue px-3 py-2 text-white font-bold"
            >
              Create a project
            </div>
          </div>
        )}
      </div>
    )
  );
};
