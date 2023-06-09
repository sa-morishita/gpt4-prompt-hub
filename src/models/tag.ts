import { z } from "zod";

export interface TagType {
  id: string;
  name: string;
}

export const tagCreateSchema = z.object({
  name: z.string().min(2),
});

export interface TagsAutocompletionProps {
  tags: TagType[];
  selectedTags: TagType[];
  setSelectedTags: React.Dispatch<React.SetStateAction<TagType[]>>;
}
