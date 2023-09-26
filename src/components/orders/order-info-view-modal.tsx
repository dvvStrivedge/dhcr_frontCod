import ConfirmationCard from '@/components/ui/cards/confirmation';
import {
  useModalAction,
  useModalState,
} from '@/components/modal-views/context';
import { useDeleteCard } from '@/data/card';

export default function OrderInfoViewModal() {
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const { deleteCard, isLoading } = useDeleteCard();

  function handleDelete() {
    // if (!card_id) {
    //     return;
    // }
    // deleteCard({ id: card_id });
  }

  return (
    <div className="flex h-full min-h-screen w-screen flex-col justify-center bg-light p-7 text-left dark:bg-dark-250 xs:h-auto xs:min-h-0 sm:w-96 md:rounded-xl">
      <div className="h-full w-full text-center">
        <div className="flex h-full flex-col justify-between">
          {/* <p className="mt-4 mb-1 text-xl font-bold text-black dark:text-light">
                        Information
                    </p> */}
          <p className="mb-1 px-6 py-2 leading-relaxed">{data?.content}</p>
        </div>
      </div>
    </div>
  );
}
