"use client";

import AIDesigner from "@/app/components/ai-designer/AIDesigner";

export default function AIDesignerPage() {
  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ 
      height: 'calc(100vh - 96px)',
      minHeight: 'calc(100vh - 96px)',
      marginTop: '0px',
      marginBottom: '0px',
      paddingTop: '0px',
      paddingBottom: '0px'
    }}>
      <AIDesigner />
    </div>
  );
}

