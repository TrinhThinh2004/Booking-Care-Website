import BookingForm from "../../../../components/booking/BookingForm";
import { Header } from "@/components/layout/Header";
interface Props {
  params: {
    doctorId: string;
  };
}

export default function Page({ params }: Props) {
  const { doctorId } = params;

  return (
    <><Header />
    <div>
    

      {/* BookingForm is a client component that will fetch doctor details and handle submit */}
      {/* Passing doctorId so it can request doctor info */}
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <BookingForm doctorId={doctorId} />
    </div>
    </>
  );
}
