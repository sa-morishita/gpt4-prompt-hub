import Modal from "../Modal";
import { useModal } from "../Modal/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { tagCreateSchema } from "~/models/tag";
import { api } from "~/utils/api";

const TagForm: FC = () => {
  const { isOpen, closeModal } = useModal("tagFormModal");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    name: string;
  }>({
    resolver: zodResolver(tagCreateSchema),
  });

  const tagRouter = api.useContext().tag;

  const createTag = api.tag.createTag.useMutation({
    onSuccess: async () => {
      toast.success("タグが生成されました");
      reset();
      closeModal();
      await tagRouter.getTags.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="タグを生成">
      <form
        onSubmit={handleSubmit((data) => createTag.mutate(data))}
        className="relative flex flex-col items-center justify-center space-y-4"
      >
        <input
          type="text"
          id="name"
          className="h-full w-full rounded-xl border border-gray-300 p-4 outline-none focus:border-gray-600"
          placeholder="タグの名前"
          {...register("name")}
        />
        <p className="w-full pb-2 text-left text-sm text-red-500">
          {errors.name?.message}
        </p>
        <div className="flex w-full justify-end">
          <button
            className="w-fit space-x-3 whitespace-nowrap rounded border border-gray-200 px-4 py-2 text-right text-sm transition hover:border-gray-900 hover:text-gray-900"
            type="submit"
          >
            {!createTag.isLoading ? (
              "生成"
            ) : (
              <span className="inline-flex items-center gap-px">
                <span className="animate-blink mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                <span className="animate-blink mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
                <span className="animate-blink mx-px h-1.5 w-1.5 rounded-full bg-indigo-600"></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TagForm;
