import Spinner from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center py-20">
      <Spinner overlay />
    </div>
  );
}
