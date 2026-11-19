import type { FC } from "react";
import { SearchHeader } from "./SearchHeader";
import { SearchContent } from "./SearchContent";

export const SearchMenu = () => {
  return (
    <div>
      <SearchHeader />
      <SearchContent items={[]}/>
    </div>
  )
}