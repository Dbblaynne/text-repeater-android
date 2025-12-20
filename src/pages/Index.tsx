import SMSAutomation from "@/components/SMSAutomation";

const Index = () => {
  return (
    <main className="min-h-screen bg-background py-12 px-4">
      {/* Background gradient effect */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <SMSAutomation />
    </main>
  );
};

export default Index;
