export function Card({ children }) {
  return <div className="p-4 bg-white shadow-md rounded">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
