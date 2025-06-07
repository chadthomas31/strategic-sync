import React, { useState, useEffect } from 'react';

interface CommandOutput {
  text: string;
  delay: number;
  class?: string;
}

interface Command {
  command: string;
  delay: number;
  output: CommandOutput[];
}

interface TerminalItem {
  type: 'command' | 'output' | 'spacer' | 'prompt';
  text?: string;
  class?: string;
  typing?: boolean;
}

const StrategicSyncHero: React.FC = () => {
  const [terminalContent, setTerminalContent] = useState<TerminalItem[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  const commands: Command[] = [
    {
      command: 'strategicsync --analyze-operations --client="Fortune500Retail"',
      delay: 1000,
      output: [
        { text: 'Analyzing operational inefficiencies...', delay: 800, class: 'text-blue-300' },
        { text: '├── Inventory management: 23% waste reduction opportunity', delay: 600, class: 'text-yellow-400 font-semibold' },
        { text: '├── Customer service: 40% response time improvement potential', delay: 600, class: 'text-yellow-400 font-semibold' },
        { text: '└── Supply chain: $2.3M annual cost savings identified', delay: 600, class: 'text-yellow-400 font-semibold' }
      ]
    },
    {
      command: 'strategicsync --implement-ai-strategy --focus="customer-experience"',
      delay: 2000,
      output: [
        { text: 'Deploying AI strategy framework...', delay: 800, class: 'text-blue-300' },
        { text: '✓ Chatbot integration: +35% customer satisfaction', delay: 700, class: 'text-green-400 font-semibold' },
        { text: '✓ Predictive analytics: +28% retention rate', delay: 700, class: 'text-green-400 font-semibold' },
        { text: '✓ Personalization engine: +42% conversion rate', delay: 700, class: 'text-green-400 font-semibold' }
      ]
    },
    {
      command: 'strategicsync --roi-report --timeframe="6months"',
      delay: 2500,
      output: [
        { text: 'Strategic AI Implementation Results:', delay: 800, class: 'text-green-300 font-bold text-lg' },
        { text: '• Cost Reduction: $5.2M annually', delay: 600, class: 'text-yellow-400 font-semibold' },
        { text: '• Efficiency Gains: 34% average improvement', delay: 600, class: 'text-yellow-400 font-semibold' },
        { text: '• Revenue Growth: +18% quarter-over-quarter', delay: 600, class: 'text-yellow-400 font-semibold' },
        { text: '• Time-to-Market: 50% faster product launches', delay: 600, class: 'text-yellow-400 font-semibold' }
      ]
    },
    {
      command: 'strategicsync --status',
      delay: 2000,
      output: [
        { text: 'Ready to transform your business? Contact Strategic Sync...', delay: 1000, class: 'text-green-400 font-semibold animate-pulse' }
      ]
    }
  ];

  useEffect(() => {
    const runAnimation = async () => {
      for (let i = 0; i < commands.length; i++) {
        await new Promise(resolve => setTimeout(resolve, commands[i].delay));
        
        // Type command
        setTerminalContent(prev => [...prev, { type: 'command', text: commands[i].command, typing: true }]);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update to show complete command
        setTerminalContent(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'command', text: commands[i].command, typing: false };
          return updated;
        });
        
        // Add output lines
        for (let j = 0; j < commands[i].output.length; j++) {
          await new Promise(resolve => setTimeout(resolve, commands[i].output[j].delay));
          setTerminalContent(prev => [...prev, { 
            type: 'output', 
            text: commands[i].output[j].text, 
            class: commands[i].output[j].class 
          }]);
        }
        
        // Add spacing
        setTerminalContent(prev => [...prev, { type: 'spacer' }]);
      }
      
      // Add final prompt
      setTerminalContent(prev => [...prev, { type: 'prompt' }]);
    };

    const timer = setTimeout(runAnimation, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const FloatingIcon: React.FC<{ icon: string; className: string }> = ({ icon, className }) => (
    <div className={`absolute text-2xl opacity-10 animate-bounce ${className}`}>
      {icon}
    </div>
  );

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleServicesClick = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Floating Background Elements */}
      <FloatingIcon icon="⚡" className="top-20 left-10 animate-pulse" />
      <FloatingIcon icon="🚀" className="top-32 right-20 animation-delay-1000" />
      <FloatingIcon icon="📊" className="bottom-40 left-16 animation-delay-2000" />
      <FloatingIcon icon="🎯" className="bottom-20 right-32 animation-delay-3000" />
      <FloatingIcon icon="💡" className="top-1/2 left-12 animation-delay-4000" />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Brand Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
                Strategic Sync
              </h1>
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed">
                Transform your business with AI that delivers measurable results. 
                We don't just implement technology—we architect strategic advantages.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleContactClick}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Start Your AI Transformation
              </button>
              <button 
                onClick={handleServicesClick}
                className="border-2 border-purple-500 text-purple-300 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                View Our Services
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">$50M+</div>
                <div className="text-slate-400">Cost Savings Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">200+</div>
                <div className="text-slate-400">AI Implementations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">85%</div>
                <div className="text-slate-400">ROI Improvement</div>
              </div>
            </div>
          </div>

          {/* Terminal Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-slate-700/80 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-slate-300 font-medium">Strategic Sync AI Console</div>
            </div>
            
            {/* Terminal Body */}
            <div className="p-6 font-mono text-sm h-96 overflow-y-auto bg-slate-900/90">
              {terminalContent.map((item, index) => {
                if (item.type === 'command') {
                  return (
                    <div key={index} className="flex items-center mb-2">
                      <span className="text-purple-400 mr-2 font-bold">></span>
                      <span className="text-cyan-300 font-medium">
                        {item.typing ? (
                          <span className="animate-pulse">{item.text}</span>
                        ) : (
                          item.text
                        )}
                      </span>
                    </div>
                  );
                } else if (item.type === 'output') {
                  return (
                    <div key={index} className={`ml-4 mb-1 ${item.class || 'text-slate-300'}`}>
                      {item.text}
                    </div>
                  );
                } else if (item.type === 'spacer') {
                  return <div key={index} className="h-4"></div>;
                } else if (item.type === 'prompt') {
                  return (
                    <div key={index} className="flex items-center">
                      <span className="text-purple-400 mr-2 font-bold">></span>
                      {showCursor && <span className="w-2 h-5 bg-purple-400 animate-pulse"></span>}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategicSyncHero;
