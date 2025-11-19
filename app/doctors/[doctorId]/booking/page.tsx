import BookingForm from "../../../../components/booking/BookingForm";
import { Header } from "@/components/layout/Header";
interface Props {
  params: {
    doctorId: string;
  };
}

export default async function Page({ params }: Props) {
  const { doctorId } = await params;

  return (
    <><Header />
    <div>
      <BookingForm doctorId={doctorId} />
    </div>
    </>
  );
}
