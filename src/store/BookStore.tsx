import { Thought } from "@/app/page";
import { BookPageProps } from "@/components/page/bookPage";
import { useBookPagination } from "@/globalHooks/useBookPagination";
import { createContext, useContext, ReactNode, Dispatch, SetStateAction } from "react";

export interface BookPaginationContextProps {
  paginatedThoughts: BookPageProps[];
  currentPageId: number;
  goToPage: (pageId: number | null) => void;
  setContainerHeight: Dispatch<SetStateAction<number>>;
  measuredContent: ReactNode;
  setMeasuredContent: Dispatch<SetStateAction<ReactNode>>;
  thoughts: Thought[];
  isMeasuring: boolean;
  setIsMeasuring: Dispatch<SetStateAction<boolean>>;
  setThoughts: Dispatch<SetStateAction<Thought[]>>;
}

export const BookPaginationContext = createContext<BookPaginationContextProps | null>(null);

export const useBookPaginationContext = (): BookPaginationContextProps => {
  const context = useContext(BookPaginationContext);
  if (!context) {
    throw new Error("useBookPaginationContext must be used within a BookPaginationProvider");
  }
  return context;
};

interface BookPaginationProviderProps {
  children: ReactNode;
  thoughts: Thought[];
  setThoughts: React.Dispatch<React.SetStateAction<Thought[]>>;
}

export const BookPaginationProvider: React.FC<BookPaginationProviderProps> = ({ children, thoughts, setThoughts }) => {
  const paginationState = useBookPagination(thoughts, setThoughts);

  return <BookPaginationContext.Provider value={paginationState}>{children}</BookPaginationContext.Provider>;
};
