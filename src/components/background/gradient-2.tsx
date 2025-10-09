export function Gradient2() {
  return (
    <div className="absolute inset-0 w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_50%,rgba(255,0,150,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.03)_49%,rgba(255,255,255,0.03)_51%,transparent_52%)] bg-size-[20px_20px] animate-pulse"></div>
    </div>
  );
}
