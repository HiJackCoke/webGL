const CardDetailContent = ({ isVertical = false }) => {
  const className = isVertical
    ? "-translate-x-1/2 w-[40vh]"
    : "-translate-y-1/2 h-[40vw]";

  return (
    <div className={`duration-0.2 z-10 absolute left-1/2 top-1/2 ${className}`}>
      CardDetailContent
    </div>
  );
};

export default CardDetailContent;
