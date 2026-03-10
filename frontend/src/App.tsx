import { Button } from './components/Button';
import { Github, Linkedin } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 dark:text-white mb-4">
          🚀
        </h1>
        <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          Coming Soon
        </h2>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-12">
          Something awesome is under construction. Check back soon!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center ">
          <Button
            contentType="both"
            type="filled"
            icon={Github}
            iconPosition="left"
            status="active"
            fillColor="bg-white"
            textColor="text-slate-900"
            hoverFillColor="hover:bg-slate-300"
            href="https://github.com/Aturinda-D/headroom"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Button>
          <Button
            contentType="both"
            type="outline"
            icon={Linkedin}
            iconPosition="left"
            status="active"
            borderColor="border-white"
            textColor="text-white"
            hoverFillColor="hover:bg-slate-300"
            hoverTextColor="hover:text-slate-900"
            href="https://www.linkedin.com/in/aturinda-david/"
            target="_blank"
            rel="noopener noreferrer"
            className="dark:border-slate-600 dark:text-white"
          >
            LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
}
