const SeverityBadge = ({ severity }) => {
  const colors = {
    mild: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    severe: 'bg-orange-100 text-orange-800',
    fatal: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[severity] || 'bg-gray-100 text-gray-800'}`}>
      {severity?.toUpperCase()}
    </span>
  );
};

export default SeverityBadge;