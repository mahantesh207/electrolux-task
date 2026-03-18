import SkeletonProductCard from "./SkeletonProductCard";

type GridLoaderProps = {
  count?: number;
};

export default function GridLoader({ count = 6 }: GridLoaderProps) {
  return (
    <div className="row">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
}
