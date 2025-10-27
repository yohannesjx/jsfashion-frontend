export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`font-black tracking-tight text-xl ${className}`}>
      JS<span className="text-brand-500">FASHION</span>
    </div>
  )
}