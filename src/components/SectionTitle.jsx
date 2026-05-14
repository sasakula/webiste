const SectionTitle = ({ eyebrow, title, description, align = 'center' }) => {
  const alignment =
    align === 'left'
      ? 'text-left items-start'
      : 'text-center items-center mx-auto';

  return (
    <div
      className={`reveal flex flex-col gap-4 max-w-2xl ${alignment}`}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight text-brand-900">
        {title}
      </h2>
      {description && (
        <p className="text-base sm:text-lg text-brand-700/80 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
