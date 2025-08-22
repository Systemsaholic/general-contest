import { MultiStepForm } from "@/components/multi-step-form"

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
        style={{
          backgroundImage: "url('/images/tropical-beach.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 w-full h-full bg-black/50 z-[-1]" />
      <div className="w-full max-w-screen-sm mx-auto">
        <MultiStepForm />
      </div>
    </main>
  )
}
